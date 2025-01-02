import $api from '../http';

export default class TagsService {
  static async addTags(value: string) {
    return $api.post(`/tags`, { value });
  }

  static async getTagsCloud() {
    return $api.get('/tags-cloud');
  }

  static async getTags() {
    return $api.get('/tags');
  }
}
