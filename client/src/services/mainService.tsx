import $api from '../http';

export default class MainService {
  static async topTemplates() {
    return $api.get(`/top-templates`);
  }

  static async latestTemplate() {
    return $api.get(`/latest-templates`);
  }
}
