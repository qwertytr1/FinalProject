import $api from '../http';

export default class FormService {
  static async formPost(templateId: number) {
    return $api.post('/forms', { templates_id: templateId }); // Send templates_id in the request body
  }
}
