export class AppError {
  static userAlreadyExists = new AppError("User01", "User already exists.");
  static userMissingInfo = new AppError(
    "User02",
    "User add request required information missing.",
  );

  code: string;
  description: string;

  constructor(code: string, description: string) {
    this.code = code;
    this.description = description;
  }
}
