import $api from '../http';

export default class AnswerService {
  static async answerPost(data: {
    answer: string;
    questions_id: number;
    forms_id: number;
  }) {
    return $api.post(`/answer`, data);
  }
}
