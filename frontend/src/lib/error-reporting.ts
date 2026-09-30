/**
 * Application Runtime Error Reporting Utility
 */

export function reportRuntimeError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  
  if (process.env.NODE_ENV !== "production") {
    console.error("[Runtime Error]", message, stack, context);
  }
}
