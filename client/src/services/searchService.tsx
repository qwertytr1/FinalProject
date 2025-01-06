import $api from '../http';

export default class SearchService {
  static async search(query: string) {
    return $api.get(`/search?query=${query}`);
  }
}
