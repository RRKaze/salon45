// utils/api/services/authService.ts
import { api } from '../client';

export const authService = {
  login: async (username: string, password: string) => {
    return api.post<{ success: boolean }>(
      `/api/auth/login?username=${username}&password=${password}`
    );
  },
  
  logout: async () => {
    return api.post('/api/auth/logout');
  },
};