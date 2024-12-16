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
const commentsController = require('../controllers/commentsController.js');
const authMiddleware = require('../middleware/auth-middleware.js');
const checkAdmin = require('../middleware/role-middleware');
const questionController = require('../controllers/questionController.js');
const formsController = require('../controllers/formsControlleer.js')
const answerController = require('../controllers/answersController.js')

//auth
router.post('/register', body('email').isEmail(), authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);

//Users
router.get('/getUsers', authMiddleware, authController.getAllUsers);
router.get('/getUsers/:id?', authController.getUser);
router.put('/user/:id', checkAdmin, authController.editUser);
router.post('/user/block/:id', checkAdmin, authController.toggleBlock);
router.post('/user/unblock/:id', checkAdmin, authController.toggleUnblock);
router.delete('/users/:id', checkAdmin, authController.deleteUser);

//templates
router.get('/templates', getTemplates);
router.get('/templates/:id', getTemplateById);
router.post('/templates', createTemplate);
router.patch('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);

//questions
router.post('/templates/:id/questions', questionController.addQuestions);
router.patch('/templates/:id/questions/:questionId', questionController.editQuestions);
router.delete('/templates/:id/questions/:questionId', questionController.deleteQuestions);

//comments
router.get('/templates/:id/comments', commentsController.getCommentsByTemplates);
router.get('/users/:id/comments', commentsController.getCommentsByUsers);
router.post('/templates/:id/comments', commentsController.addComment);

//forms
router.get('/forms', formsController.getAllForms);
router.get('/forms/:id', formsController.getFormsById);
router.patch('/forms/:id', formsController.updateForms);
router.post('/forms', formsController.createForms);
router.delete('/forms/:id', formsController.deleteForms);

//answers
router.post('/answer', answerController.addAnswer);

module.exports = router;