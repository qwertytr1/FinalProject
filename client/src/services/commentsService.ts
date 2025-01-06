import $api from '../http';

export default class CommentsService {
  static async commentPost(id: number, newComment: string) {
    return $api.post(`/templates/${id}/comments`, { newComment });
  }

  static async commentDelete(id: number) {
    return $api.delete(`/comments/${id}`);
  }

  static async getComment(id: number) {
    return $api.get(`/templates/${id}/comments`);
  }
}
