const axios = require('axios');
require('dotenv').config();

class SalesforceService {
  constructor() {
    this.clientId = process.env.SALESFORCE_CLIENT_ID;
    this.clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
    this.username = process.env.SALESFORCE_USERNAME;
    this.password = process.env.SALESFORCE_PASSWORD;
    this.tokenUrl = 'https://login.salesforce.com/services/oauth2/token';
  }

  async getAccessToken() {
    try {
      const response = await axios.post(this.tokenUrl, null, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: {
          grant_type: 'password',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          username: this.username,
          password: this.password,
        },
      });

      return {
        accessToken: response.data.access_token,
        instanceUrl: response.data.instance_url,
      };
    } catch (error) {
      console.error('Failed to fetch Salesforce access token:', error.response?.data || error.message);
      throw new Error('Salesforce authentication failed');
    }
  }
  async findAccountByNameOrPhone(Name, Phone) {
    try {
      const { accessToken, instanceUrl } = await this.getAccessToken();

      const query = `SELECT Id, Name, Phone FROM Account WHERE Name = '${Name}' OR Phone = '${Phone}'`;
      const response = await axios.get(`${instanceUrl}/services/data/v57.0/query?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data.records; // Возвращаем найденные записи
    } catch (error) {
      console.error('Error finding Salesforce account:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to search for Salesforce account');
    }
  }
  async createAccount(Name, Phone) {
    try {
      // Проверяем, есть ли уже такой пользователь
      const existingAccounts = await this.findAccountByNameOrPhone(Name, Phone);
      if (existingAccounts.length > 0) {
        return {
          success: false,
          message: 'An account with the same Name or Phone already exists.',
          existingAccounts,
        };
      }

      // Если записи нет, создаем новый аккаунт
      const { accessToken, instanceUrl } = await this.getAccessToken();
      const accountPayload = { Name, Phone };
      const response = await axios.post(
        `${instanceUrl}/services/data/v57.0/sobjects/Account`,
        accountPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating Salesforce account:', error.response?.data || error.message);
      throw new Error(error.response?.data?.[0]?.message || 'Failed to create Salesforce account');
    }
  }
}

module.exports = new SalesforceService();
