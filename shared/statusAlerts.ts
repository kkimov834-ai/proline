export type OperationErrorDetails = {
  message: string;
  status?: number;
};

type ErrorLike = {
  message?: string;
  data?: { httpStatus?: number };
  shape?: { data?: { httpStatus?: number } };
};

export function getOperationErrorDetails(error: unknown, fallback: string): OperationErrorDetails {
  const candidate = (error || {}) as ErrorLike;
  const status = candidate.data?.httpStatus ?? candidate.shape?.data?.httpStatus;
  const message = candidate.message && candidate.message !== "Unexpected error" ? candidate.message : fallback;
  return { message, status };
}

export function formatOperationError(error: unknown, fallback: string): string {
  const { message, status } = getOperationErrorDetails(error, fallback);
  return `${message}${status ? `\n${status}` : ""}`;
}
