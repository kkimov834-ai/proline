import { describe, expect, it } from "vitest";
import { isPendingNoticeForUser } from "./prolineNotifications";

const notice = (to: "orders" | "production" | "polishing" | "paint" | "warehouse", requester = "22", status = "pending") => ({ to, requester, status });

describe("PROLINE notification visibility", () => {
  it("shows a return-to-orders request to the admin user", () => {
    expect(isPendingNoticeForUser(notice("orders", "22"), "admin", 7)).toBe(true);
  });

  it("keeps department requests scoped to their target role", () => {
    expect(isPendingNoticeForUser(notice("production", "22"), "production", 7)).toBe(true);
    expect(isPendingNoticeForUser(notice("production", "22"), "paint", 7)).toBe(false);
  });

  it("shows the requester their own pending request but not completed ones", () => {
    expect(isPendingNoticeForUser(notice("paint", "7"), "production", 7)).toBe(true);
    expect(isPendingNoticeForUser(notice("paint", "7", "accepted"), "production", 7)).toBe(false);
  });
});
