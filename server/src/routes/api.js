const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js'); // Предположим, что ваши контроллеры здесь
const {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require('../controllers/controller.js');
const { body } = require('express-validator');

const authMiddleware = require('../middleware/auth-middleware.js');
const checkAdmin = require('../middleware/role-middleware');

router.post('/register',
  body('email').isEmail(),
  authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);
router.get('/getUsers', authMiddleware, authController.getAllUsers);
router.get('/getUsers/:id?', authController.getUser);
router.delete('/templates/:id', deleteTemplate);

router.put('/user/:id', checkAdmin, authController.editUser);
router.post('/user/block/:id', authController.toggleBlock);
router.post('/user/unblock/:id', authController.toggleUnblock);
router.delete('/users/:id', authController.deleteUser);

router.get('/templates', getTemplates);
router.get('/templates/:id', getTemplateById);
router.post('/templates', createTemplate);
router.patch('/templates/:id', updateTemplate);

module.exports = router;