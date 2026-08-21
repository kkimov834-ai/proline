import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const credentials = [
  ["sifariş", "admin"],
  ["istehsalat", "production"],
  ["cilalama", "polishing"],
  ["boyalama", "paint"],
  ["anbar", "warehouse"],
] as const;

function createContext() {
  const cookies: Array<{ name: string; value: string }> = [];
  const ctx: TrpcContext = {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string) => cookies.push({ name, value }),
      clearCookie: () => undefined,
    } as TrpcContext["res"],
  };
  return { ctx, cookies };
}

describe("PROLINE board.login", () => {
  it.each(credentials)("accepts %s as the %s role with normalized code", async (email, role) => {
    const { ctx, cookies } = createContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.board.login({ email: `  ${email.toUpperCase()}  `, code: " 010203 " });
    expect(result.email).toBe(email);
    expect(result.role).toBe(role);
    expect(cookies[0]?.name).toBe("proline_session");
    ctx.req.headers.cookie = `proline_session=${cookies[0]?.value}`;
    const restored = await caller.board.session();
    expect(restored.email).toBe(email);
    expect(restored.role).toBe(role);
  });

  it("rejects an incorrect access code", async () => {
    const { ctx } = createContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.board.login({ email: "sifariş", code: "010204" })).rejects.toThrow("Email və ya giriş kodu yanlışdır.");
  });
});
