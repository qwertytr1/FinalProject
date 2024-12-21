import $api from "../http/index";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponce";
export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/login', {email, password})
    }
    static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post('/register', { email, password })
    }
    static async logout(): Promise<void> {
        return $api.post('/logout')
    }
}