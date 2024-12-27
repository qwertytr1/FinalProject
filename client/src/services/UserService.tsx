import { type AxiosResponse } from 'axios';
import $api from '../http';
import { type IUser } from '../models/IUser';

export default class UserService {
  static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return $api.get<IUser[]>('/getUsers');
  }

  static async edit(
    id: number,
    userData: {
      username: string;
      email: string;
      password: string;
      language: string;
      theme: string;
      role: string;
    },
  ): Promise<AxiosResponse<IUser>> {
    try {
      const response = await $api.put(`/user/${id}`, userData);
      if (response.data) {
        return response;
      }
      throw new Error('Invalid server response');
    } catch (error) {
      console.error('Error in UserService.edit:', error);
      throw error;
    }
  }

  static async toggleBlockUser(userId: string) {
    return $api.post(`/user/block/${userId}`);
  }

  static async toggleUnblockUSer(userId: string) {
    return $api.post(`/user/unblock/${userId}`);
  }
}
