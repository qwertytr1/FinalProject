import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";

export default class Store {
    user = {} as IUser;
    isAuth = false;

    constructor() {
        makeAutoObservable(this)
    }
    setAuth(bool: boolean) {
        this.isAuth = bool;
    }
    setUser(user:IUser){
        this.user = user;
    }
    async login(email: string, password: string) {
        try {
          const response = await AuthService.login(email, password);
          console.log(response);
          localStorage.setItem('token', response.data.accessToken);
          this.setAuth(true);
          this.setUser(response.data.user);
        } catch (e: any) {
          if (e.response) {
            // Server responded with a status outside 2xx
            console.error('Server Error:', e.response.data);
          } else if (e.request) {
            // Request was made, but no response received
            console.error('Network Error:', e.request);
          } else {
            // Other errors
            console.error('Error:', e.message);
          }
        }
      }
    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            if (e instanceof Error) {
                // e is narrowed to Error!
                console.log(e.message);
            }
        }
    }
    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            if (e instanceof Error) {
                // e is narrowed to Error!
                console.log(e.message);
            }
        }
    }
}