const { Template, Like, Tag, Form } = require('../models/index.js');
const { Sequelize } = require("sequelize");

class TemplateController {
  static async getLatestTemplates(req, res) {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const latestTemplates = await Template.findAll({
        where: {
          created_at: {
            [Sequelize.Op.gte]: oneDayAgo,
          },
        },
        order: [['created_at', 'DESC']],
      });

      res.status(200).json(latestTemplates);
    } catch (error) {
      res.status(500).json({ error: 'Не удалось получить последние шаблоны' });
    }
  }

  static async getTopTemplates(req, res) {
    try {
      const topTemplates = await Template.findAll({
        attributes: {
          include: [
            [
              Sequelize.literal(`(
                SELECT COUNT(*)
                FROM forms AS f
                WHERE f.templates_id = templates.id
              )`),
              "formsCount",
            ],
          ],
        },
        order: [[Sequelize.literal("formsCount"), "DESC"]],
        limit: 10,
      });

      res.status(200).json(topTemplates);
    } catch (error) {
      res.status(500).json({ error: "Не удалось получить топовые шаблоны" });
    }
  }

  static async getTagsCloud(req, res) {
    try {
      const tagsCloud = await Tag.findAll({
        attributes: [
          'value',
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM template_tags AS tt
              WHERE tt.tags_id = tags.id
            )`),
            'usageCount',
          ],
        ],
        order: [[Sequelize.literal('usageCount'), 'DESC']],
      });

      res.status(200).json(tagsCloud);
    } catch (error) {
      res.status(500).json({ error: 'Не удалось получить облако тегов' });
    }
  }
}

module.exports = TemplateController;
const { Template, Like, Tag, Form } = require('../models/index.js');
const { Sequelize } = require("sequelize");

class TemplateController {
  static async getLatestTemplates(req, res) {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const latestTemplates = await Template.findAll({
        where: {
          created_at: {
            [Sequelize.Op.gte]: oneDayAgo,
          },
        },
        order: [['created_at', 'DESC']],
      });

      res.status(200).json(latestTemplates);
    } catch (error) {
      res.status(500).json({ error: 'Не удалось получить последние шаблоны' });
    }
  }

  static async getTopTemplates(req, res) {
    try {
      const topTemplates = await Template.findAll({
        attributes: {
          include: [
            [
              Sequelize.literal(`(
                SELECT COUNT(*)
                FROM forms AS f
                WHERE f.templates_id = templates.id
              )`),
              "formsCount",
            ],
          ],
        },
        order: [[Sequelize.literal("formsCount"), "DESC"]],
        limit: 10,
      });

      res.status(200).json(topTemplates);
    } catch (error) {
      res.status(500).json({ error: "Не удалось получить топовые шаблоны" });
    }
  }

  static async getTagsCloud(req, res) {
    try {
      const tagsCloud = await Tag.findAll({
        attributes: [
          'value',
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM template_tags AS tt
              WHERE tt.tags_id = tags.id
            )`),
            'usageCount',
          ],
        ],
        order: [[Sequelize.literal('usageCount'), 'DESC']],
      });

      res.status(200).json(tagsCloud);
    } catch (error) {
      res.status(500).json({ error: 'Не удалось получить облако тегов' });
    }
  }
}

module.exports = TemplateController;
