export class appError {
    static userAlreadyExists = new appError("User01", "User already exists.");
    static userMissingInfo = new appError("User02", "User add request required information missing.");

    code: string;
    description: string;

    constructor(code: string, description: string){
        this.code = code;
        this.description = description;
    }
}
