const FormService = require('../services/forms-service.js');
const { Template, Form, User } = require("../models/index");
const tokenService = require('../services/token-service.js');

class FormController {
  static async getAllForms(req, res, next) {
    try {
      const forms = await FormService.getAllTemplatesWithForms();
      res.status(forms.status).json(forms.json);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getFormsById(req, res, next) {
    const { id } = req.params;
    try {
      const forms = await FormService.getFormsById(id);
      res.status(forms.status).json(forms.json);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getFormsByUserTemplates(req, res, next) {
    const { userId } = req.params;
    try {
      const result = await FormService.getFormsByUserTemplates(userId);
      res.status(result.status).json(result.json);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateForms(req, res, next) {
    const { id } = req.params;
    const formData = req.body;
    try {
      const forms = await FormService.updateForms(id, formData);
      res.status(forms.status).json(forms.json);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createForms(req, res, next) {
    const accessToken = req.headers['authorization']?.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token missing' });
    }

    let userData;
    try {
      userData = tokenService.validateAccessToken(accessToken);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = userData.id;
    if (!userId) {
      return res.status(401).json({ error: 'User is not authorized' });
    }

    const { templates_id } = req.body;
    try {
      const template = await Template.findByPk(templates_id);
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const form = await Form.create({
        templates_id,
        users_id: userId,
        submitted_at: new Date(),
      });

      res.status(201).json({ message: 'Form created successfully', form });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteForms(req, res, next) {
    const { id } = req.params;
    try {
      const forms = await FormService.deleteForms(id);
      res.status(forms.status).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = FormController;
