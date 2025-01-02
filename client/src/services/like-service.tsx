import $api from '../http';

export default class LikeService {
  static async likePost(id: number) {
    return $api.post(`/templates/${id}/like`);
  }

  static async likeDelete(id: number) {
    return $api.delete(`/templates/${id}/like`);
  }

  static async getLike(id: number) {
    return $api.get(`/templates/${id}/like`);
  }
}
