const { Like, Template } = require('../models/index.js');
const jwt = require('jsonwebtoken'); // Для работы с токенами
const tokenService = require('../services/token-service.js')

// Получение количества лайков для шаблона
exports.getLikes = async (req, res, next) => {
  const { id: templateId } = req.params;

  try {
    // Считаем количество лайков для шаблона
    const likesCount = await Like.count({ where: { templates_id: templateId } });
    return res.json({ templateId, likes: likesCount });
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка при получении количества лайков' });
  }
};

// Добавление лайка к шаблону
exports.addLike = async (req, res) => {
  const templateId = req.params.id;
  const accessToken = req.headers['authorization']?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  try {
    // Validate the token
    const userData = tokenService.validateAccessToken(accessToken);

    // Check if userData is valid
    if (!userData || !userData.id) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    const userId = userData.id;

    // Check if the like already exists
    const existingLike = await Like.findOne({
      where: { users_id: userId, templates_id: templateId },
    });

    if (existingLike) {
      return res.status(400).json({ message: 'You already liked this template' });
    }

    // Add the like
    await Like.create({ templates_id: templateId, users_id: userId });
    return res.status(201).json({ message: 'Like added successfully' });
  } catch (error) {
    console.error('Error adding like:', error);
    return res.status(500).json({ error: 'Error adding like', details: error.message });
  }
};

  // Удаление лайка с шаблона
  exports.removeLike = async (req, res) => {
    const templateId = req.params.id;
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    try {
      // Validate the token
      const userData = tokenService.validateAccessToken(accessToken);

      // Check if userData is valid
      if (!userData || !userData.id) {
        return res.status(401).json({ error: 'User not authorized' });
      }

      const userId = userData.id;

      // Find the like record
      const like = await Like.findOne({
        where: { templates_id: templateId, users_id: userId },
      });

      if (!like) {
        return res.status(404).json({ message: 'Like not found' });
      }

      // Delete the like
      await like.destroy();
      return res.json({ message: 'Like removed successfully' });
    } catch (error) {
      console.error('Error removing like:', error);
      return res.status(500).json({ error: 'Error removing like', details: error.message });
    }
  };