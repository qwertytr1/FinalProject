import axios from "axios";
import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import { AuthResponse } from "../models/response/AuthResponce";
import AuthService from "../services/AuthService";
import $api, { API_URL } from "../http";
import UserService from "../services/UserService";

export default class Store {
    user: Partial<IUser> = {}; // Используем Partial для необязательных полей
    users: IUser[] = []; // Хранение списка пользователей
    isAuth = false;
    isLoading = false;
    isCheckedAuth = false; // Новый флаг для отслеживания состояния проверки аутентификации

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(isAuth: boolean) {
        this.isAuth = isAuth;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setUsers(users: IUser[]) {
        this.users = users;
    }

    setLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.error("Login error:", e);
        }
    }

    async register(
        username: string,
        email: string,
        password: string,
        language: string,
        theme: string,
        role: string
    ) {
        try {
            const response = await AuthService.register(username, email, password, language, theme, role);
            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            if (e instanceof Error) {
                console.error("Registration error:", e.message);
            }
        }
    }

    async logout() {
        try {
            await $api.post("/logout");
            localStorage.removeItem("token");
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            console.error("Logout error:", e);
        }
    }


    async checkAuth() {
        if (this.isCheckedAuth) return;

        this.isLoading = true;
        this.isCheckedAuth = true;
        try {
            const response = await $api.get(`/refresh`);
            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.error("Check auth error:", e);
        } finally {
            this.isLoading = false;
        }
    }
    async edit(
        id: number,
        userData: { username: string; email: string; password: string; language: string; theme: string; role: string }
    ) {
        try {
            const response = await UserService.edit(id, userData);
            if (response && response.data) {
                this.setUser(response.data);
                return response.data;
            } else {
                throw new Error("Invalid response structure from server");
            }
        } catch (e) {
            console.error("Error in edit method:", e);
            throw e;
        }
    }

    async handleSaveChanges(formData: {
        username: string;
        email: string;
        password: string;
        language: string;
        theme: string;
    }) {
        try {
            const userData = {
                username: formData.username || this.user.username || "",
                email: formData.email || this.user.email || "",
                password: formData.password || "",
                language: formData.language || this.user.language || "",
                theme: formData.theme || this.user.theme || "",
                role: this.user.role || "user",
            };
            const updatedUser = await this.edit(this.user.id!, userData); // Используем non-null assertion
            this.setUser(updatedUser);
        } catch (error) {
            console.error("Error saving profile changes:", error);
            alert("Failed to save changes. Please try again.");
        }
    }

    async getUsers() {
        try {
            const response = await UserService.fetchUsers();
            console.log("Fetched users:", response.data);
            this.setUsers(response.data);
        } catch (e) {
            console.error("Error fetching users:", e);
        }
    }

}
