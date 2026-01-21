import { AppError, errorMiddleware } from "./AppError";
import { ErrorCode, ErrorMessage } from "./ErrorEnum";

describe("AppError", () => {
  it("deve criar erro com mensagem e statusCode padrao", () => {
    const error = new AppError("Test error");
    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(500);
    expect(error.name).toBe("AppError");
  });

  it("deve criar erro com statusCode customizado", () => {
    const error = new AppError("Not found", 404);
    expect(error.message).toBe("Not found");
    expect(error.statusCode).toBe(404);
  });

  it("deve ser instancia de Error", () => {
    const error = new AppError("Test");
    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
  });
});

describe("errorMiddleware", () => {
  it("deve retornar erro formatado para AppError", () => {
    const error = new AppError("Test error", 400);
    const result = errorMiddleware(error);
    expect(result).toEqual({
      success: false,
      error: "Test error",
      statusCode: 400,
    });
  });

  it("deve retornar erro generico para erro desconhecido", () => {
    const error = new Error("Unknown");
    const result = errorMiddleware(error);
    expect(result).toEqual({
      success: false,
      error: ErrorMessage.INTERNAL_SERVER_ERROR,
      statusCode: ErrorCode.INTERNAL_ERROR,
    });
  });

  it("deve retornar erro generico para valor nao-erro", () => {
    const result = errorMiddleware("string error");
    expect(result).toEqual({
      success: false,
      error: ErrorMessage.INTERNAL_SERVER_ERROR,
      statusCode: ErrorCode.INTERNAL_ERROR,
    });
  });
});
