export interface IUser {
    email: string;
    id: number;
    username?: string;
    password?: string;
    language?: string;
    theme?: string;
    role?: string;
    isBlocked?: boolean; // Add this if it's part of the user data.
}