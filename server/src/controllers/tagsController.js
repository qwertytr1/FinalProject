const { Tag } = require('../models/index.js');

class TagController {
  static async getTags(req, res) {
    try {
      const tags = await Tag.findAll();
      return res.json(tags);
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка при получении тегов', details: error.message });
    }
  }

  static async createTag(req, res) {
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({ error: 'Поле value обязательно для создания тега.' });
    }

    try {
      const newTag = await Tag.create({ value });
      return res.status(201).json(newTag);
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка при создании тега', details: error.message });
    }
  }
}

module.exports = TagController;
