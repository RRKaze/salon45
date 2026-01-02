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

export interface UserResponseDto {
  id: string;
  username: string;
  phone: string;
  email?: string | undefined;
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequestDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

export const userService = {
  createUser: async (userData: NewUserRequestDto) => {
    return api.post<NewUserResponseDto>('/api/users/add', userData);
  },
  getCurrentUser: async () => {
    return api.get<UserResponseDto>('/api/users/me');
  },
  updateUser: async (userId: string, userData: UpdateUserRequestDto) => {
    return api.post<UserResponseDto>(`/api/users/update/${userId}`, userData);
  },
};