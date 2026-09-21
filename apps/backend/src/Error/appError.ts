export class AppError extends Error {
  // make them public
  public success: boolean;
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;

    // maintain proper stack trace for where our error was thrown 
    Error.captureStackTrace(this, this.constructor);
  }
}