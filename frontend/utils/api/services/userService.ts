// utils/api/services/userService.ts
import { api } from '../client';

interface NewUserRequestDto {
  username: string;
  password: string;
  phone: string;
  email?: string;
  firstName: string;
  lastName: string;
}

interface NewUserResponseDto {
    id: string;
    username: string;
    phone: string;
    email?: string | undefined;
    firstName: string;
    lastName: string;
    error: string;
}

export const userService = {
  createUser: async (userData: NewUserRequestDto) => {
    return api.post<NewUserResponseDto>('/api/users/add', userData);
  },
};