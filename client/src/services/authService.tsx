import { type AxiosResponse } from 'axios';
import $api from '../http/index';
import { type AuthResponse } from '../models/response/authResponce';

export default class AuthService {
  static async login(
    email: string,
    password: string,
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/login', { email, password });
  }

  static async register(
    username: string,
    email: string,
    password: string,
    language: string,
    theme: string,
    role: string,
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/register', {
      username,
      email,
      password,
      language,
      theme,
      role,
    });
  }

  static async logout(): Promise<void> {
    return $api.post('/logout', { withCredentials: true });
  }
}
