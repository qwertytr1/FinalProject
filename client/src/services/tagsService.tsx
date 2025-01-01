import $api from '../http';

export default class TagsService {
  static async addTags(name: string) {
    return $api.post(`/tags`, { name });
  }
}
