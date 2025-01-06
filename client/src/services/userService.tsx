import { type AxiosResponse } from 'axios';
import $api from '../http';
import { type IUser } from '../models/iUser';

export default class UserService {
  static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return $api.get<IUser[]>('/getUsers');
  }

  static async editUsers(
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
    return $api.put(`/user/${id}`, userData);
  }

  static async toggleBlockUser(userId: string) {
    return $api.post(`/user/block/${userId}`);
  }

  static async changeRole(
    id: number,
    role: string,
  ): Promise<AxiosResponse<IUser>> {
    return $api.put(`/user/${id}`, { role });
  }

  static async toggleUnblockUSer(userId: string) {
    return $api.post(`/user/unblock/${userId}`);
  }

  static async deleteUser(userId: number) {
    return $api.delete(`/users/${userId}`);
  }
}
