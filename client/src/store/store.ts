import { makeAutoObservable } from 'mobx';
import { type IUser } from '../models/iUser';
import AuthService from '../services/authService';
import $api from '../http';
import UserService from '../services/userService';

export default class Store {
  user: Partial<IUser> = {};

  users: IUser[] = [];

  isAuth = false;

  isLoading = false;

  isCheckedAuth = false;

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
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      console.error('Login error:', e);
    }
  }

  async register(
    username: string,
    email: string,
    password: string,
    language: string,
    theme: string,
    role: string,
  ) {
    try {
      const response = await AuthService.register(
        username,
        email,
        password,
        language,
        theme,
        role,
      );
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      if (e instanceof Error) {
        console.error('Registration error:', e.message);
      }
    }
  }

  async logout() {
    try {
      await $api.post('/logout');
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (e) {
      console.error('Logout error:', e);
    }
  }

  async checkAuth() {
    if (this.isCheckedAuth) return;

    this.isLoading = true;
    this.isCheckedAuth = true;
    try {
      const response = await $api.get('/refresh');
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      console.error('Check auth error:', e);
    } finally {
      this.isLoading = false;
    }
  }

  async edit(
    id: number,
    userData: {
      username: string;
      email: string;
      password: string;
      language: string;
      theme: string;
      role: string;
    },
  ) {
    try {
      const response = await UserService.editUsers(id, userData);
      if (response && response.data) {
        this.setUser(response.data);
        return response.data;
      }
      throw new Error('Invalid response structure from server');
    } catch (e) {
      console.error('Error in edit method:', e);
      throw e;
    }
  }

  async saveEditUsers(formData: {
    username: string;
    email: string;
    password: string;
    language: string;
    theme: string;
  }) {
    try {
      const userData = {
        username: formData.username || this.user.username || '',
        email: formData.email || this.user.email || '',
        password: formData.password || '',
        language: formData.language || this.user.language || '',
        theme: formData.theme || this.user.theme || '',
        role: this.user.role || 'user',
      };
      const updatedUser = await this.edit(this.user.id!, userData);
      this.setUser(updatedUser);
    } catch (error) {
      console.error('Error saving profile changes:', error);
      alert('Failed to save changes. Please try again.');
    }
  }
}
