import $api from '../http';
import { Questions } from '../models/questions';

export default class QuestionService {
  static async addQuestion(id: number, values: Questions) {
    return $api.post(`/templates/${id}`, values);
  }
}
