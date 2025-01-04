import $api from '../http';

export default class FormService {
  static async formPost(templateId: number) {
    return $api.post('/forms', { templates_id: templateId });
  }

  static async formDelete(templateId: number) {
    return $api.delete(`/forms/${templateId}`);
  }

  static async getUserTemplates(userId: number | undefined) {
    return $api.get(`/forms/user-templates/${userId}`);
  }

  static async getForms() {
    return $api.get('/forms');
  }

  static async getFormUser(userId: number) {
    return $api.get(`/forms/${userId}`);
  }
}
