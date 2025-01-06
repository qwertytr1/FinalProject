import $api from '../http';
import { Questions } from '../models/questions';

export default class QuestionService {
  static async addQuestion(id: number, values: Questions) {
    return $api.post(`/templates/${id}/questions`, values);
  }

  static async getQuestion(id: number) {
    return $api.get(`/templates/${id}/questions`);
  }

  static async editQuestion(
    templateId: number,
    questionId: number,
    questionData: {
      title: string;
      description?: string;
      order?: number;
      type?: string;
      showInResults?: boolean;
      correctAnswer?: string;
    },
  ) {
    return $api.patch(
      `/templates/${templateId}/questions/${questionId}`,
      questionData,
    );
  }

  static async deleteQuestion(id: number, questionId: number) {
    return $api.delete(`/templates/${id}/questions/${questionId}`);
  }

  static async editOrderQuestion(
    id: number,
    questionId: number,
    questionData: {
      title: string;
      description?: string;
      order?: number;
      type?: string;
      showInResults?: boolean;
      correctAnswer?: string;
    },
  ) {
    return $api.patch(`/templates/${id}/questions/${questionId}`, {
      questionData,
    });
  }
}
