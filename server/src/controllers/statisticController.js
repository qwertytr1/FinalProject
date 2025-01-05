const { User, Template, Form, Comment } = require('../models/index.js');

class StatisticsController {
  static async getStatistics(req, res) {
    try {
      const userCount = await User.count();
      const templateCount = await Template.count();
      const formCount = await Form.count();
      const commentCount = await Comment.count();

      return res.status(200).json({
        users: userCount,
        templates: templateCount,
        forms: formCount,
        comments: commentCount
      });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении статистики', details: error.message });
    }
  }
}

module.exports = StatisticsController;
