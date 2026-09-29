export type ProlineNotificationColumn = string;
export type ProlineNotificationRole = string;

export function prolineApprovalTargetRole(to: string): string {
  return to === "orders" ? "admin" : to;
}

export function canRespondToPendingNotice(to: string, role: string) {
  return role === prolineApprovalTargetRole(to);
}

const roleColumn: Record<string, string | undefined> = {
  admin: undefined,
  production: "production",
  polishing: "polishing",
  paint: "paint",
  warehouse: "warehouse",
};

export function isPendingNoticeForUser(
  notice: { status: string; to: string; requester: string | number },
  role: string,
  userId: number,
) {
  if (notice.status !== "pending") return false;
  if (role === "admin" && notice.to === "orders") return true;
  return roleColumn[role] === notice.to || Number(notice.requester) === userId;
}
