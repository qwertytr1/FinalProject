import { makeAutoObservable } from 'mobx';
import { message } from 'antd';
import { IUser } from '../models/iUser';
import AuthService from '../services/authService';
import $api from '../http';
import UserService from '../services/userService';
import { Templates } from '../models/templates';
import SearchService from '../services/searchService';

interface Template {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  created_at: string;
}

interface Tag {
  id: number;
  value: string;
}

interface Comment {
  id: number;
  content: string;
  user?: {
    username: string;
  };
}

interface SearchResults {
  templates: Template[];
  templatesByTags: Template[];
  comments: Comment[];
  tags: Tag[];
}

export default class Store {
  user: Partial<IUser> = {};

  users: IUser[] = [];

  query = '';

  isAuth = false;

  isLoading = false;

  theme: 'light-theme' | 'dark-theme' =
    (localStorage.getItem('theme') as 'light-theme' | 'dark-theme') ||
    'light-theme';

  correctAnswersCount = 0;

  results: SearchResults = {
    templates: [],
    templatesByTags: [],
    comments: [],
    tags: [],
  };

  answeredQuestionsCount = 0;

  templates: Templates[] = [];

  isCheckedAuth = false;

  formId: number | null = null;

  isFormCreated: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setTheme(theme: 'light-theme' | 'dark-theme') {
    this.theme = theme;
    localStorage.setItem('theme', theme);
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme);
  }

  setQuery(query: string) {
    this.query = query;
  }

  setTemplate(templates: Templates[]) {
    this.templates = templates;
  }

  setFormId(id: number) {
    this.formId = id;
    this.isFormCreated = true;
  }

  async search(query: string) {
    if (!query) {
      return Promise.reject(new Error('Query is empty'));
    }
    try {
      const response = await SearchService.search(query);
      this.results = response.data;
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  setAuth(isAuth: boolean) {
    this.isAuth = isAuth;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  incrementCorrectAnswers() {
    this.correctAnswersCount += 1;
  }

  incrementAnsweredQuestions() {
    this.answeredQuestionsCount += 1;
  }

  resetCounts() {
    this.correctAnswersCount = 0;
    this.answeredQuestionsCount = 0;
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
      if (response.data.user.isBlocked) {
        message.error('Your account is blocked. Please contact support.');
        this.setAuth(false);
        return;
      }
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      console.error('Login error:', error);
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
    }
  }
}
