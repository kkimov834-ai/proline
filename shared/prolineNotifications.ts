export type ProlineNotificationColumn = "orders" | "production" | "polishing" | "paint" | "warehouse";
export type ProlineNotificationRole = "admin" | "production" | "polishing" | "paint" | "warehouse";

const roleColumn: Record<ProlineNotificationRole, ProlineNotificationColumn | undefined> = {
  admin: undefined,
  production: "production",
  polishing: "polishing",
  paint: "paint",
  warehouse: "warehouse",
};

export function isPendingNoticeForUser(
  notice: { status: string; to: ProlineNotificationColumn; requester: string | number },
  role: ProlineNotificationRole,
  userId: number,
) {
  if (notice.status !== "pending") return false;
  if (role === "admin" && notice.to === "orders") return true;
  return roleColumn[role] === notice.to || Number(notice.requester) === userId;
}
