export class UsersError {
  static userAlreadyExists = new UsersError("User01", "User already exists.");
  static userMissingInfo = new UsersError(
    "User02",
    "User add request required information missing.",
  );
  static userNotFound = new UsersError("User03", "User not found.");

  code: string;
  description: string;

  constructor(code: string, description: string) {
    this.code = code;
    this.description = description;
  }
}
