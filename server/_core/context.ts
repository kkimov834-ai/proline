import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // PROLINE uses its own `proline_session` cookie/Bearer token for public
  // tRPC procedures. Do not pass that Bearer token into Manus OAuth auth;
  // Manus expects an app_session_id payload and logs it as an invalid 401.
  const hasManusSessionCookie = (opts.req.headers.cookie || "")
    .split(";")
    .some((part) => part.trim().startsWith("app_session_id="));

  if (hasManusSessionCookie) {
    try {
      user = await sdk.authenticateRequest(opts.req);
    } catch {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
