const { User, Template, Form, Comment } = require('../models/index.js'); // Импортируем модели

exports.getStatistics = async (req, res) => {
  try {
    // Получаем количество пользователей
    const userCount = await User.count();

    // Получаем количество шаблонов
    const templateCount = await Template.count();

    // Получаем количество форм
    const formCount = await Form.count();

    // Получаем количество комментариев
    const commentCount = await Comment.count();

    // Отправляем статистику в ответе
    return res.status(200).json({
      users: userCount,
      templates: templateCount,
      forms: formCount,
      comments: commentCount
    });
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    return res.status(500).json({ error: 'Ошибка при получении статистики', details: error.message });
  }
};
