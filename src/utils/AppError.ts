import { ErrorCode, ErrorMessage } from "./ErrorEnum.js";

class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = ErrorCode.INTERNAL_ERROR
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

function errorMiddleware(error: unknown) {
  if (error instanceof AppError) {
    return { success: false, error: error.message, statusCode: error.statusCode };
  }
  return { success: false, error: ErrorMessage.INTERNAL_SERVER_ERROR, statusCode: ErrorCode.INTERNAL_ERROR };
}

export { AppError, errorMiddleware };
