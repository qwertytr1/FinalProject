const { Template, Question, Comment, Tag, TemplatesTag } = require('../models/index.js');
const { Op } = require('sequelize');

exports.searchTemplates = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Параметр "query" обязателен для поиска.' });
  }

  try {

    const templates = await Template.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      }
    });

    const questions = await Question.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      }
    });

    const comments = await Comment.findAll({
      where: {
        content: { [Op.like]: `%${query}%` }
      }
    });

    const tags = await Tag.findAll({
      where: {
        value: { [Op.like]: `%${query}%` }
      }
    });

    const templateTagData = await TemplatesTag.findAll({
      where: {
        tags_id: {
          [Op.in]: tags.map(tag => tag.id)
        }
      },
      attributes: ['templates_id', 'tags_id']
    });


    const templateIds = templateTagData.length > 0 ? templateTagData.map(item => item.templates_id) : [];

    const templatesByTags = templateIds.length > 0 ? await Template.findAll({
      where: {
        id: { [Op.in]: templateIds }
      }
    }) : [];

    return res.status(200).json({
      templates,
      templatesByTags,
      comments,
      tags
    });
  } catch (error) {
    console.error('Ошибка при выполнении поиска:', error);
    return res.status(500).json({ error: 'Ошибка при выполнении поиска', details: error.message });
  }
};
