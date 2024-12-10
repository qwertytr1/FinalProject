const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Предположим, что ваши контроллеры здесь
const {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require('../controllers/controller.js');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth-middleware.js');
router.post('/register',
  body('email').isEmail(),
  authController.register);
router.post('/login', authController.login);

router.get('/templates', getTemplates);          // Получить все шаблоны
router.get('/templates/:id', getTemplateById);   // Получить шаблон по ID
router.post('/templates', createTemplate);  // Создать шаблон
router.patch('/templates/:id', updateTemplate);  // Обновить шаблон

router.post('/logout', authController.logout);
router.get('/me', authController.me);
router.get('/refresh', authController.refresh);
router.get('/getUsers',authMiddleware, authController.getUsers);
router.delete('/templates/:id', deleteTemplate);

module.exports = router;