import $api from '../http';

export default class AnswerService {
  static async answerPost(value: string) {
    return $api.post(`/answer`, value);
  }
}
