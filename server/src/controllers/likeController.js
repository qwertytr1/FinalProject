const { Like, User } = require('../models/index.js');
const tokenService = require('../services/token-service.js');

class LikeController {
  static async getLikes(req, res) {
    const { id: templateId } = req.params;

    try {
      const likes = await Like.findAll({
        where: { templates_id: templateId },
        include: [
          {
            model: User,
            attributes: ['id', 'username'],
          },
        ],
      });

      const likesCount = likes.length;

      const users = likes.map(like => ({
        userId: like.user ? like.user.dataValues.id : null,
        username: like.user ? like.user.dataValues.username : null,
      }));

      return res.json({ templateId, likes: likesCount, users });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка при получении количества лайков' });
    }
  }

  static async addLike(req, res) {
    const templateId = req.params.id;
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    try {
      const userData = tokenService.validateAccessToken(accessToken);

      if (!userData || !userData.id) {
        return res.status(401).json({ error: 'User not authorized' });
      }

      const userId = userData.id;

      const existingLike = await Like.findOne({
        where: { users_id: userId, templates_id: templateId },
      });

      if (existingLike) {
        return res.status(400).json({ message: 'You already liked this template' });
      }

      await Like.create({ templates_id: templateId, users_id: userId });
      return res.status(201).json({ message: 'Like added successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Error adding like', details: error.message });
    }
  }

  static async removeLike(req, res) {
    const templateId = req.params.id;
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    try {
      const userData = tokenService.validateAccessToken(accessToken);

      if (!userData || !userData.id) {
        return res.status(401).json({ error: 'User not authorized' });
      }

      const userId = userData.id;

      const like = await Like.findOne({
        where: { templates_id: templateId, users_id: userId },
      });

      if (!like) {
        return res.status(404).json({ message: 'Like not found' });
      }

      await like.destroy();
      return res.json({ message: 'Like removed successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Error removing like', details: error.message });
    }
  }
}

module.exports = LikeController;
