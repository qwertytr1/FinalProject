const SalesforceService = require('../services/salesformes-service.js');
require("dotenv").config();
const axios = require('axios');

class SalesforceController {
  static async Salesforce(req, res) {
    try {
      const { Name, Phone } = req.body;

      const result = await SalesforceService.createAccount(Name, Phone);

      if (!result.success) {
        return res.status(409).json({
          success: false,
          message: result.message,
          existingAccounts: result.existingAccounts
        }); // Конфликт (409) для уже существующих данных
      }

      return res.status(201).json({ success: true, data: result.data }); // Успешное создание
    } catch (error) {
      console.error('Error in SalesforceController:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = SalesforceController;