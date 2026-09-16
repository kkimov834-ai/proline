import { z } from "zod";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import { prolineNotifications, prolineOrders, users } from "../drizzle/schema";
import {
  addAuditLog,
  addComment,
  deleteOrder,
  deletePushSubscription,
  exportOrders,
  getAuditLogs,
  getComments,
  getDb,
  getNotificationPreference,
  getOrCreateProlineUser,
  getWorkspaceSettings,
  listBoardData,
  insertOrder,
  savePushSubscription,
  saveWorkspaceSettings,
  setNotificationPreference,
} from "./db";
import { storagePut } from "./storage";
import { COOKIE_NAME } from "@shared/const";
import {
  canProlineRoleMove,
  PROLINE_ACCESS_CODE,
  PROLINE_ROLE_MAP,
} from "@shared/prolineAuth";
import { prolineApprovalTargetRole } from "@shared/prolineNotifications";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getPushPublicKey,
  isPushConfigured,
  prolineColumnLabel,
  sendPushToRole,
  sendPushToUser,
} from "./push";

const roleMap: Record<
  string,
  { role: string; label: string; column?: string }
> = PROLINE_ROLE_MAP;
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "proline-local-session-secret"
);
async function persistImage(imageUrl: string | undefined, userId: number) {
  if (!imageUrl || !imageUrl.startsWith("data:")) return imageUrl || null;
  const match = imageUrl.match(/^data:([^;,]+);base64,([\s\S]+)$/);
  if (!match)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Şəkil formatı dəstəklənmir.",
    });
  const [, contentType, encoded] = match;
  const extension = contentType.split("/")[1] || "jpeg";
  const uploaded = await storagePut(
    `proline-orders/${userId}/${randomUUID()}.${extension}`,
    Buffer.from(encoded, "base64"),
    contentType
  );
  return uploaded.url;
}
async function signSession(email: string, companyId: string) {
  return new SignJWT({ email, companyId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);
}
async function sessionEmail(req: {
  headers: { cookie?: string; authorization?: string };
}) {
  const cookieToken = req.headers.cookie
    ?.split(";")
    .map(v => v.trim())
    .find(v => v.startsWith("proline_session="))
    ?.split("=")[1];
  const bearerToken = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const raw = cookieToken || bearerToken;
  if (!raw)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "PROLINE session tələb olunur",
    });
  try {
    const verified = await jwtVerify(raw, secret);
    return String(verified.payload.email);
  } catch {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "PROLINE session etibarsızdır",
    });
  }
}
async function sessionCompany(req: {
  headers: { cookie?: string; authorization?: string };
}) {
  const cookieToken = req.headers.cookie
    ?.split(";")
    .map(v => v.trim())
    .find(v => v.startsWith("proline_session="))
    ?.split("=")[1];
  const bearerToken = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const raw = cookieToken || bearerToken;
  if (!raw)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "PROLINE session tələb olunur",
    });
  try {
    const verified = await jwtVerify(raw, secret);
    return String(verified.payload.companyId || "default");
  } catch {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "PROLINE session etibarsızdır",
    });
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie("proline_session", {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 0,
      });
      return { success: true } as const;
    }),
  }),
  push: router({
    config: publicProcedure.query(() => ({
      publicKey: getPushPublicKey(),
      configured: isPushConfigured(),
    })),
    subscribe: publicProcedure
      .input(
        z.object({
          endpoint: z.string().url().max(2048),
          keys: z.object({
            p256dh: z.string().min(1).max(255),
            auth: z.string().min(1).max(255),
          }),
          userAgent: z.string().max(512).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const email = await sessionEmail(ctx.req);
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const operatorRows = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
        const operator = operatorRows[0];
        if (!operator) throw new Error("Operator tapılmadı");
        return savePushSubscription(operator.id, input);
      }),
    unsubscribe: publicProcedure
      .input(z.object({ endpoint: z.string().url().max(2048) }))
      .mutation(async ({ input, ctx }) => {
        await sessionEmail(ctx.req);
        return deletePushSubscription(input.endpoint);
      }),
  }),
  board: router({
    session: publicProcedure.query(async ({ ctx }) => {
      const email = await sessionEmail(ctx.req);
      const found = roleMap[email];
      if (!found) throw new Error("PROLINE session etibarsızdır");
      const db = await getDb();
      const rows = db
        ? await db.select().from(users).where(eq(users.email, email)).limit(1)
        : [];
      return {
        email,
        role: found.role,
        label: rows[0]?.name || found.label,
        column: found.column,
        userId: rows[0]?.id || 0,
      };
    }),
    login: publicProcedure
      .input(
        z.object({
          email: z.string(),
          code: z.string(),
          name: z.string().trim().min(2).max(80),
          company: z.string().trim().min(2).max(80),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const normalized = input.email.trim().toLowerCase();
        const name = input.name.trim();
        const companyId = input.company
          .trim()
          .toLocaleLowerCase("az-AZ")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        const found = roleMap[normalized];
        if (!found || input.code.trim() !== PROLINE_ACCESS_CODE || !companyId)
          throw new Error("Giriş məlumatları yanlışdır.");
        const saved = await getOrCreateProlineUser(
          normalized,
          name,
          found.role
        );
        const token = await signSession(normalized, companyId);
        ctx.res.cookie("proline_session", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          path: "/",
          maxAge: 12 * 60 * 60 * 1000,
        });
        return {
          email: normalized,
          role: found.role,
          label: saved?.name || name,
          column: found.column,
          userId: saved?.id || 0,
          companyId,
          token,
        };
      }),
    list: publicProcedure.query(async ({ ctx }) =>
      listBoardData(await sessionEmail(ctx.req))
    ),
    heartbeat: publicProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const email = await sessionEmail(ctx.req);
      await db
        .update(users)
        .set({ lastSignedIn: new Date() })
        .where(eq(users.email, email));
      return { success: true };
    }),
    notificationPreference: publicProcedure.query(async ({ ctx }) =>
      getNotificationPreference(await sessionEmail(ctx.req))
    ),
    setNotificationPreference: publicProcedure
      .input(z.object({ enabled: z.boolean() }))
      .mutation(async ({ input, ctx }) =>
        setNotificationPreference(await sessionEmail(ctx.req), input.enabled)
      ),
    audit: publicProcedure
      .input(z.object({ orderId: z.number().optional() }).optional())
      .query(async ({ input, ctx }) => {
        await sessionEmail(ctx.req);
        return getAuditLogs(input?.orderId);
      }),
    workspace: publicProcedure.query(async ({ ctx }) => {
      await sessionEmail(ctx.req);
      return getWorkspaceSettings(await sessionCompany(ctx.req));
    }),
    saveWorkspace: publicProcedure
      .input(z.object({ config: z.string().min(2).max(50000) }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const email = await sessionEmail(ctx.req);
        const operator = (
          await db.select().from(users).where(eq(users.email, email)).limit(1)
        )[0];
        if (!operator || operator.prolineRole !== "admin")
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Studyo mod yalnız Admin üçün açıqdır.",
          });
        // Only JSON configurations are accepted; the client owns the presentation schema.
        try {
          JSON.parse(input.config);
        } catch {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Studyo konfiqurasiyası düzgün deyil.",
          });
        }
        return saveWorkspaceSettings(
          input.config,
          operator.id,
          await sessionCompany(ctx.req)
        );
      }),
    comments: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input, ctx }) => {
        await sessionEmail(ctx.req);
        return getComments(input.orderId);
      }),
    addComment: publicProcedure
      .input(
        z.object({
          orderId: z.number(),
          body: z.string().trim().min(1).max(2000),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const email = await sessionEmail(ctx.req);
        const operatorRows = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
        const operator = operatorRows[0];
        if (!operator) throw new Error("Operator tapılmadı");
        const order = await db
          .select({ id: prolineOrders.id })
          .from(prolineOrders)
          .where(eq(prolineOrders.id, input.orderId))
          .limit(1);
        if (!order[0]) throw new Error("Sifariş tapılmadı");
        const comment = await addComment({
          orderId: input.orderId,
          authorUserId: operator.id,
          body: input.body,
        });
        await addAuditLog({
          orderId: input.orderId,
          actorUserId: operator.id,
          action: "commented",
          details: "Sifarişə şərh əlavə edildi",
        });
        return {
          ...comment,
          authorName: operator.name || operator.email || "İşçi",
        };
      }),
    export: publicProcedure.query(async ({ ctx }) => {
      const email = await sessionEmail(ctx.req);
      const operatorRows = await getDb().then(db =>
        db
          ? db
              .select({ prolineRole: users.prolineRole })
              .from(users)
              .where(eq(users.email, email))
              .limit(1)
          : []
      );
      if (operatorRows[0]?.prolineRole !== "admin")
        throw new Error("Excel funksiyaları yalnız Admin üçün açıqdır.");
      return exportOrders();
    }),
    create: publicProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          priority: z.enum(["low", "normal", "high", "urgent"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const email = await sessionEmail(ctx.req);
        const operatorRows = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
        const operator = operatorRows[0];
        if (!operator || operator.prolineRole !== "admin")
          throw new Error("Yalnız Dispatcher sifariş yarada bilər.");
        const imageUrl = await persistImage(input.imageUrl, operator.id);
        const created = await insertOrder({
          publicId: `PL-${randomUUID().replaceAll("-", "").slice(0, 28)}`,
          title: input.title,
          description: input.description || null,
          imageUrl,
          priority: input.priority,
          columnId: "orders",
          createdByUserId: operator.id,
          stageEnteredAt: new Date(),
        });
        if (created)
          await addAuditLog({
            orderId: created.id,
            actorUserId: operator.id,
            action: "created",
            toColumn: "orders",
            details: "Sifariş yaradıldı",
          });
        return created;
      }),
    delete: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const email = await sessionEmail(ctx.req);
        const operatorRows = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
        const operator = operatorRows[0];
        if (!operator || operator.prolineRole !== "admin")
          throw new Error("Yalnız Admin sifariş silə bilər.");
        const order = await db
          .select({ id: prolineOrders.id })
          .from(prolineOrders)
          .where(eq(prolineOrders.id, input.orderId))
          .limit(1);
        if (!order[0]) throw new Error("Sifariş tapılmadı.");
        await deleteOrder(input.orderId);
        return { success: true };
      }),
    update: publicProcedure
      .input(
        z.object({
          orderId: z.number(),
          title: z.string().min(1),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          priority: z.enum(["low", "normal", "high", "urgent"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const email = await sessionEmail(ctx.req);
        const operatorRows = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
        if (operatorRows[0]?.prolineRole !== "admin")
          throw new Error("Yalnız Dispatcher redaktə edə bilər.");
        const imageUrl = await persistImage(
          input.imageUrl,
          operatorRows[0]?.id || 0
        );
        await db
          .update(prolineOrders)
          .set({
            title: input.title,
            description: input.description || null,
            imageUrl,
            priority: input.priority,
          })
          .where(eq(prolineOrders.id, input.orderId));
        if (operatorRows[0])
          await addAuditLog({
            orderId: input.orderId,
            actorUserId: operatorRows[0].id,
            action: "updated",
            details: "Sifariş redaktə edildi",
          });
        return { success: true };
      }),
    requestMove: publicProcedure
      .input(
        z.object({
          orderId: z.number(),
          toColumn: z.enum([
            "orders",
            "production",
            "polishing",
            "paint",
            "warehouse",
          ]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const email = await sessionEmail(ctx.req);
        const operator = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
        const current = operator[0];
        if (!current) throw new Error("Operator tapılmadı");
        if (input.toColumn === current.prolineRole)
          throw new Error("Sifariş artıq bu sütundadır.");
        const rows = await db
          .select()
          .from(prolineOrders)
          .where(eq(prolineOrders.id, input.orderId))
          .limit(1);
        const order = rows[0];
        if (!order) throw new Error("Sifariş tapılmadı");
        if (input.toColumn === order.columnId)
          throw new Error("Sifariş artıq bu sütundadır.");
        if (order.pendingTo)
          throw new Error("Bu sifariş üçün artıq cavab gözlənilir.");
        if (
          !canProlineRoleMove(
            current.prolineRole as
              | "admin"
              | "production"
              | "polishing"
              | "paint"
              | "warehouse",
            order.columnId,
            input.toColumn
          )
        )
          throw new Error("Bu mərhələyə keçid üçün icazəniz yoxdur.");
        const targetRole = prolineApprovalTargetRole(input.toColumn);
        await db
          .update(prolineOrders)
          .set({ pendingTo: input.toColumn, rejectedReason: null })
          .where(eq(prolineOrders.id, input.orderId));
        await db
          .insert(prolineNotifications)
          .values({
            orderId: input.orderId,
            fromColumn: order.columnId,
            toColumn: input.toColumn,
            requesterUserId: current.id,
            targetRole,
            status: "pending",
          });
        void sendPushToRole(targetRole, {
          title: "PROLINE · Yeni təsdiq sorğusu",
          body: `${order.title} sifarişinin ${prolineColumnLabel(input.toColumn)} mərhələsinə keçidi üçün təsdiq tələb olunur.`,
          tag: `proline-approval-${input.orderId}`,
          url: "/",
          type: "approval-request",
          orderId: input.orderId,
        });
        await addAuditLog({
          orderId: input.orderId,
          actorUserId: current.id,
          action: "move_requested",
          fromColumn: order.columnId,
          toColumn: input.toColumn,
          details: "Mərhələ keçidi üçün təsdiq göndərildi",
        });
        return { success: true };
      }),
    respond: publicProcedure
      .input(
        z.object({
          notificationId: z.number(),
          accepted: z.boolean(),
          reason: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const email = await sessionEmail(ctx.req);
        const operatorRows = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
        const operator = operatorRows[0];
        const notices = await db
          .select()
          .from(prolineNotifications)
          .where(eq(prolineNotifications.id, input.notificationId))
          .limit(1);
        const notice = notices[0];
        if (!notice) throw new Error("Bildiriş tapılmadı");
        if (notice.status !== "pending")
          throw new Error("Bu bildiriş artıq cavablandırılıb.");
        if (!operator || operator.prolineRole !== notice.targetRole)
          throw new Error("Bu bildirişə cavab vermək icazəniz yoxdur.");
        await db
          .update(prolineNotifications)
          .set({
            status: input.accepted ? "accepted" : "rejected",
            reason: input.reason || null,
            respondedAt: new Date(),
          })
          .where(eq(prolineNotifications.id, input.notificationId));
        if (input.accepted) {
          await db
            .update(prolineOrders)
            .set({
              columnId: notice.toColumn,
              pendingTo: null,
              rejectedReason: null,
              stageEnteredAt: new Date(),
            })
            .where(eq(prolineOrders.id, notice.orderId));
          await addAuditLog({
            orderId: notice.orderId,
            actorUserId: operator.id,
            action: "accepted",
            fromColumn: notice.fromColumn,
            toColumn: notice.toColumn,
            details: "Mərhələ keçidi qəbul edildi",
          });
        } else {
          await db
            .update(prolineOrders)
            .set({
              pendingTo: null,
              rejectedReason: input.reason || "Səbəb qeyd edilməyib.",
            })
            .where(eq(prolineOrders.id, notice.orderId));
          await addAuditLog({
            orderId: notice.orderId,
            actorUserId: operator.id,
            action: "rejected",
            fromColumn: notice.fromColumn,
            toColumn: notice.toColumn,
            details: input.reason || "Mərhələ keçidi rədd edildi",
          });
        }
        void sendPushToUser(notice.requesterUserId, {
          title: input.accepted
            ? "PROLINE · Sifariş qəbul olundu"
            : "PROLINE · Sifariş imtina edildi",
          body: input.accepted
            ? `${notice.orderId} sifarişi ${prolineColumnLabel(notice.toColumn)} mərhələsinə keçirildi.`
            : `${notice.orderId} sifarişi üçün imtina səbəbi: ${input.reason || "Səbəb qeyd edilməyib."}`,
          tag: `proline-approval-result-${notice.orderId}`,
          url: "/",
          type: "approval-result",
          orderId: notice.orderId,
        });
        return { success: true };
      }),
  }),
});
export type AppRouter = typeof appRouter;
