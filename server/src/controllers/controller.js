const { Template, User, Tag, Question, Answer} = require("../models/index");
const cloudinary = require('../config/cloudinary');
const jwt = require('jsonwebtoken'); // Для работы с токенами
// шаблоны
const getUserIdFromToken = (req) => {
  const { refreshToken } = req.cookies; // Получаем токен из куки
  if (!refreshToken) return null;

  try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      console.log(decoded);
    return decoded.id; // Поле userId должно быть в payload токена
  } catch (err) {
    return null; // Невалидный токен
  }
};
exports.createTemplate = async (req, res) => {
  try {
    const { title, description, category, image_url, is_public } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Файл изображения не был загружен' });
    }
    const userId = getUserIdFromToken(req);
    // Загружаем изображение в Cloudinary
    console.log(userId)
    const result = await cloudinary.uploader.upload(req.file.path);

    // Создаём новый шаблон с ссылкой на изображение
    const newTemplate = await Template.create({
      title,
      description,
      category,
      image_url: result.secure_url, // Ссылка на изображение из Cloudinary
      is_public: is_public || false,
      users_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Возвращаем ответ
    return res.status(201).json({
      message: 'Шаблон успешно создан',
      template: newTemplate,
    });
  } catch (err) {
    console.error('Ошибка при создании шаблона:', err);
    return res.status(500).json({
      error: 'Ошибка при создании шаблона',
      details: err.message
    });
  }
};
//   try {
//     const { tags, category, is_public } = req.query;

//     // Создаем объект условий фильтрации
//     const filters = {};
//     if (category) filters.category = category;
//     if (is_public) filters.is_public = is_public === 'true';

//     // Если фильтр по тегам, используем ассоциацию
//     const include = [
//       { model: User, attributes: ['id', 'username'] }, // Автор
//     ];

//     if (tags) {
//       include.push({
//         model: Tag,
//         where: { name: tags.split(',') }, // Теги через запятую
//         through: { attributes: [] },
//       });
//     }

//     const templates = await Template.findAll({
//       where: filters,
//       include,
//     });

//     res.status(200).json(templates);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch templates.' });
//   }
// };
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.findAll({ include: User });
    if (templates.length === 0) {
      return res.status(200).json({ message: "No templates found." });
    }
    res.status(200).json(templates);
  } catch (err) {
    console.error("Error fetching templates:", err);
    res.status(500).json({ error: "Failed to fetch templates." });
  }
};
exports.updateTemplate = async (req, res) => {
  try {
    const [updated] = await Template.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ error: "Template not found." });
    }

    const updatedTemplate = await Template.findByPk(req.params.id);
    res.status(200).json(updatedTemplate);
  } catch (err) {
    res.status(500).json({ error: "Failed to update template." });
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.findOne({
      where: { id },
      include: User,
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found." });
    }

    res.status(200).json(template);
  } catch (err) {
    console.error("Error fetching template:", err);
    res.status(500).json({ error: "Failed to fetch template." });
  }
};


exports.deleteTemplate = async (req, res) => {
  try {


    const template = await Template.findByPk(req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found.' });
    }



    // Если изображение привязано к шаблону, удалим его из Cloudinary перед удалением шаблона
    const publicId = template.image_url.split('/').pop().split('.')[0]; // Извлекаем public_id из URL

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    // Удаление шаблона из базы данных
    await template.destroy();

    res.status(204).send(); // Ответ без содержимого, так как ресурс удалён
  } catch (err) {
    console.error('Ошибка при удалении шаблона:', err);
    res.status(500).json({ error: 'Failed to delete template.' });
  }
};
