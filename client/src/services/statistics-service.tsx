import $api from '../http/index';

export default class StatService {
  static async statistic() {
    return $api.get('/admin/statistics');
  }
}
