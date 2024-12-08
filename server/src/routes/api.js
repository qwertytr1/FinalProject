const express = require('express');
const router = express.Router();
const {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require('../controllers/controller.js');

// Конечные точки
router.get('/templates', getTemplates);          // Получить все шаблоны
router.get('/templates/:id', getTemplateById);   // Получить шаблон по ID
router.post('/templates', createTemplate);  // Создать шаблон
router.patch('/templates/:id', updateTemplate);  // Обновить шаблон
router.delete('/templates/:id', deleteTemplate); // Удалить шаблон

module.exports = router;