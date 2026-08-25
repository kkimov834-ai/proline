import { describe, expect, it } from "vitest";
import { formatOperationError, getOperationErrorDetails } from "./statusAlerts";

describe("operation status alerts", () => {
  it("keeps the readable server message and HTTP status code", () => {
    const error = { message: "Bu əməliyyat üçün icazəniz yoxdur.", data: { httpStatus: 403 } };
    expect(getOperationErrorDetails(error, "Fallback")).toEqual({ message: "Bu əməliyyat üçün icazəniz yoxdur.", status: 403 });
    expect(formatOperationError(error, "Fallback")).toBe("Bu əməliyyat üçün icazəniz yoxdur.\n403");
  });

  it("uses the fallback when the transport only reports an unexpected error", () => {
    expect(formatOperationError({ message: "Unexpected error", shape: { data: { httpStatus: 500 } } }, "Server cavab vermədi.")).toBe("Server cavab vermədi.\n500");
  });
});
