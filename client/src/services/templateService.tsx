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

  static async getTemplates() {
    return $api.get(`/templates`);
  }

  static async getAllTemplatesByUsers() {
    return $api.get(`/templates/user`);
  }

  static async getTemplateById(id: number) {
    return $api.get(`/templates/${id}`);
  }

  static async editTemplate(
    id: number,
    templateData: {
      title: string;
      description?: string;
      category?: string;
    },
  ) {
    return $api.patch(`/templates/${id}`, templateData);
  }

  static async deleteTemplate(id: number) {
    return $api.delete(`/templates/${id}`);
  }
}
