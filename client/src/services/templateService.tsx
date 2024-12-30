import $api from '../http';
import { Questions } from '../models/questions';

export default class TemplateService {
  static async addTemplate(formData: FormData) {
    return $api.post('/templates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static async addQuestions(templateId: number, questions: Questions[]) {
    return $api.post(`/templates/${templateId}/questions`, { questions });
  }

  static async getAllTemplatesByUsers(userId: number | undefined) {
    return $api.get(`/templates/user/${userId}`);
  }

  static async getTemplateById(id: number) {
    return $api.get(`/templates/${id}`);
  }
}
