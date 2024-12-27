import $api from "../http";
import { AxiosResponse } from "axios";
import { IUser } from "../models/IUser";
export default class UserService{
    static fetchUsers(): Promise<AxiosResponse<IUser[]>>{
        return $api.get<IUser[]>('/getUsers')
    }
    static async edit(
        id: number,
        userData: { username: string; email: string; password: string; language: string; theme: string; role: string }
    ): Promise<AxiosResponse<IUser>> {
        try {
            const response = await $api.put(`/user/${id}`, userData);
            if (response.data) {
                return response;
            } else {
                throw new Error("Invalid server response");
            }
        } catch (error) {
            console.error("Error in UserService.edit:", error);
            throw error;
        }
    }
    static async toggleBlock  (userId: string)  {
        return await $api.post(`/user/block/${userId}`);
      };

      static async toggleUnblock (userId: string) {
        return await $api.post(`/user/unblock/${userId}`);
      };
}
