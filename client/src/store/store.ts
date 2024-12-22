import axios from "axios";
import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import { AuthResponse } from "../models/response/AuthResponce";
import AuthService from "../services/AuthService";
import $api, {API_URL} from "../http";
export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this)
    }
    setAuth(bool: boolean) {
        this.isAuth = bool;
    }
    setUser(user:IUser){
        this.user = user;
    }
    setLoading(bool: boolean) {
        this.isLoading = bool;
    }
    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.userData.accessToken);
            this.setAuth(true);
            console.log("Stored token:", localStorage.getItem('token'));
            this.setUser(response.data.userData.user);
        } catch (e) {
            console.log(e)
        }
    }
    async registration(username:string,email: string, password: string, language:string, theme:string, role:string) {
        try {
            const response = await AuthService.registration(username, email, password, language, theme, role);

            localStorage.setItem('token', response.data.userData.accessToken);
            this.setAuth(true);
            this.setUser(response.data.userData.user);
        } catch (e) {
            if (e instanceof Error) {
                // e is narrowed to Error!
                console.log(e.message);
            }
        }
    }
    async logout() {
        try {
            const response = await $api.post('/logout');
            console.log(response);
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
            console.log("Logout response:", response.data);
        } catch (e) {
            console.error("Logout error:", e);
        }
    }
    async checkAuth() {
        this.setLoading(true);

        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            console.log(response);
            // localStorage.getItem('token')
            // localStorage.setItem('token', response.data.userData.accessToken);
            // console.log(localStorage)
            // this.setAuth(true);
            // this.setUser(response.data.userData.user);
        } catch (e) {
            console.error("checkAuth error:", e);
            this.setAuth(false);
        } finally {
            this.setLoading(false);
        }
    }
}