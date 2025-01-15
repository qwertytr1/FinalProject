import $api from '../http';

export default class SalesforceService {
  static async SalesforcePost(Name: string, Phone?: string) {
    return $api.post(`/salesforce/account`, { Name, Phone });
  }
}
