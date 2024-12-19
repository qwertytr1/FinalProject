const { Template, User, Tag, Question, Answer} = require("../models/index");

// Создание шаблона
exports.createTemplate = async (req, res) => {
  try {
    const { title, description, category, image_url, is_public, users_id } = req.body;
    const newTemplate = await Template.create({
      title,
      description,
      category,
      image_url,
      is_public,
      users_id,
      created_at: new Date(),
    });
    res.status(201).json(newTemplate);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при создании шаблона', details: err.message });
  }
};
//обновление шаблонов
//проверка что человек создавал
//проверка на админа
//проверка
// Получение всех шаблонов
// exports.getTemplates = async (req, res) => {
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
// Получение шаблона по ID
exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params; // Получаем id из параметров маршрута
    const template = await Template.findOne({
      where: { id }, // Условие поиска по id
      include: User, // Включаем связанные данные из модели User
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


// Удаление шаблона
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);

    if (!template) return res.status(404).json({ error: 'Template not found.' });

    // Проверяем права: текущий пользователь должен быть создателем или админом
    if (req.user.id !== template.users_id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Forbidden: You cannot delete this template.' });
    }

    await template.destroy();

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete template.' });
  }
};

