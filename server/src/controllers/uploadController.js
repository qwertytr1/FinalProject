const cloudinary = require('../config/cloudinary.js');
const { Template } = require('../models/index.js');

class ImageController {
  static async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Файл не был загружен' });
      }

      const result = await cloudinary.uploader.upload(req.file.path);

      const { title, description, category, is_public } = req.body;
      const template = await Template.create({
        image_url: result.secure_url,
      });

      return res.status(201).json({
        message: 'Изображение успешно загружено и добавлено в шаблон',
        template,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка при загрузке изображения' });
    }
  }

  static async deleteImage(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID изображения обязателен для удаления' });
    }

    try {
      await cloudinary.uploader.destroy(id);
      return res.status(200).json({ message: 'Изображение успешно удалено' });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка при удалении изображения' });
    }
  }
}

module.exports = ImageController;
