export interface UserRequestDto{
    username: string;
    password: string; 
    phone: string;
    email?: string;
  }

  export interface UserResponseDto{
    userid: string;
    username: string;
    phone: string;
    email?: string;
  }
  