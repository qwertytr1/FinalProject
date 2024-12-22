import { IUser } from "../IUser";

export interface AuthResponse{
    userData: {
        accessToken: string;
        refreshToken: string;
        user: IUser;
    };
}