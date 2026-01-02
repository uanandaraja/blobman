export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code = "BAD_REQUEST") {
    return new AppError(message, code, 400);
  }

  static unauthorized(message = "Unauthorized", code = "UNAUTHORIZED") {
    return new AppError(message, code, 401);
  }

  static forbidden(message = "Forbidden", code = "FORBIDDEN") {
    return new AppError(message, code, 403);
  }

  static notFound(message = "Not found", code = "NOT_FOUND") {
    return new AppError(message, code, 404);
  }

  static internal(message = "Internal server error", code = "INTERNAL_ERROR") {
    return new AppError(message, code, 500);
  }
}
