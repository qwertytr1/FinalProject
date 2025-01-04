import $api from '../http';

export default class ResultService {
  static async resultPost(id: number, score: number) {
    return $api.post(`/forms/${id}/result`, { score });
  }
}
