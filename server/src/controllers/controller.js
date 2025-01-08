const { sequelize, Template, User, Tag, Question, TemplatesAccess, Like, Comment, Form, TemplatesTag } = require("../models/index");
const cloudinary = require('../config/cloudinary');
const tokenService = require('../services/token-service.js');

class TemplateController {
  static async createTemplate(req, res) {
    try {
      const { title, description, category, image_url, is_public, tags } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "Файл изображения не был загружен" });
      }

      const accessToken = req.headers['authorization']?.split(' ')[1];
      if (!accessToken) {
        return res.status(400).json({ error: 'Токен не предоставлен' });
      }

      let userData;
      try {
        userData = tokenService.validateAccessToken(accessToken);
      } catch (error) {
        return res.status(401).json({ error: 'Недействительный токен' });
      }

      if (!userData) {
        return res.status(401).json({ error: 'Не удалось извлечь данные пользователя из токена' });
      }

      const userId = userData.id;

      const result = await cloudinary.uploader.upload(req.file.path);

      const newTemplate = await Template.create({
        title,
        description,
        category,
        image_url: result.secure_url,
        is_public: is_public || false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const tagIds = tags ? tags.split(',').map(tag => Number(tag.trim())) : [];

      if (tagIds.length === 0) {
        return res.status(400).json({ error: "Не указаны теги." });
      }

      const existingTags = await Tag.findAll({ where: { id: tagIds } });

      if (existingTags.length !== tagIds.length) {
        return res.status(400).json({ error: "Один или несколько указанных тегов не существуют." });
      }

      const templatesTagData = existingTags.map((tag) => ({
        templates_id: newTemplate.id,
        tags_id: tag.id,
      }));

      await TemplatesTag.bulkCreate(templatesTagData);

      await TemplatesAccess.create({ users_id: userId, templates_id: newTemplate.id });

      return res.status(201).json({ message: "Шаблон успешно создан", template: newTemplate });
    } catch (err) {
      res.status(500).json({ error: "Ошибка при создании шаблона", details: err.message });
    }
  }

  static async getTemplatesByUser(req, res) {
    try {
      const accessToken = req.headers['authorization']?.split(' ')[1];
      if (!accessToken) {
        return res.status(400).json({ error: 'Токен не предоставлен' });
      }

      let userData;
      try {
        userData = tokenService.validateAccessToken(accessToken);
      } catch (error) {
        return res.status(401).json({ error: 'Недействительный токен' });
      }

      const userId = userData.id;
console.log(userId)
      const templates = await Template.findAll({
        include: {
          model: TemplatesAccess,
          as: "templateAccesses",
          where: { users_id: userId },
          required: true,
        },
      });
      console.log(templates)
      if (templates.length === 0) {
        return res.status(200).json({ message: "No templates found for this user." });
      }

      res.status(200).json(templates);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch templates by user." });
    }
  }

  static async getTemplates(req, res) {
    try {
      const templates = await Template.findAll({
        include: {
          model: TemplatesAccess,
          as: 'templateAccesses',
          include: {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email'],
          },
        },
      });

      if (templates.length === 0) {
        return res.status(200).json({ message: "No templates found." });
      }

      res.status(200).json(templates);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch templates." });
    }
  }

  static async updateTemplate(req, res) {
    try {
      const { id } = req.params;
      const dataToUpdate = { ...req.body, updated_at: new Date() };

      const [updated] = await Template.update(dataToUpdate, { where: { id } });
      if (!updated) {
        return res.status(404).json({ error: "Template not found." });
      }

      const updatedTemplate = await Template.findByPk(id);
      res.status(200).json(updatedTemplate);
    } catch (err) {
      res.status(500).json({ error: "Failed to update template." });
    }
  }

  static async getTemplateById(req, res) {
    try {
      const { id } = req.params;
      const template = await Template.findOne({ where: { id } });

      if (!template) {
        return res.status(404).json({ message: "Template not found." });
      }

      res.status(200).json(template);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch template." });
    }
  }

  static async deleteTemplate(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const templateId = req.params.id;
      const accessToken = req.headers['authorization']?.split(' ')[1];

      if (!accessToken) {
        return res.status(400).json({ error: 'Токен не предоставлен' });
      }

      let userData;
      try {
        userData = tokenService.validateAccessToken(accessToken);
      } catch (error) {
        return res.status(401).json({ error: 'Недействительный токен' });
      }

      if (!userData) {
        return res.status(401).json({ error: 'Не удалось извлечь данные пользователя из токена' });
      }

      const userId = userData.id;

      const template = await Template.findByPk(templateId, { transaction });
      if (!template) {
        return res.status(404).json({ error: 'Template not found.' });
      }

      const access = await TemplatesAccess.findOne({ where: { templates_id: templateId, users_id: userId }, transaction });
      if (!access && userData.role !== 'admin') {
        return res.status(403).json({ error: 'У вас нет доступа к этому шаблону' });
      }

      const relatedTables = [
        { model: TemplatesTag, where: { templates_id: templateId } },
        { model: Like, where: { templates_id: templateId } },
        { model: Question, where: { templates_id: templateId } },
        { model: Comment, where: { templates_id: templateId } },
        { model: Form, where: { templates_id: templateId } },
      ];

      for (const { model, where } of relatedTables) {
        const count = await model.count({ where, transaction });
        if (count > 0) {
          await model.destroy({ where, transaction });
        }
      }

      await template.destroy({ transaction });
      await transaction.commit();

      res.status(204).send();
    } catch (err) {
      await transaction.rollback();
      res.status(500).json({ error: 'Failed to delete template.' });
    }
  }
}

module.exports = TemplateController;
