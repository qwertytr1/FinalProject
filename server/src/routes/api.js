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
const searchController = require('../controllers/searchController');
const { body } = require('express-validator');
const commentsController = require('../controllers/commentsController.js');
const authMiddleware = require('../middleware/auth-middleware.js');
const checkAdmin = require('../middleware/role-middleware');
const questionController = require('../controllers/questionController.js');
const formsController = require('../controllers/formsControlleer.js')
const answerController = require('../controllers/answersController.js')
const settingsController = require('../controllers/settingsController.js');
const likeController = require('../controllers/likeController.js');
const tagsController = require('../controllers/tagsController.js');
const upload = require('../middleware/upload.js');
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
router.post('/templates', upload.single('image'), createTemplate);
router.patch('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);

//questions
router.get('/templates/:id/questions', questionController.getAllQuestions);
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
router.get('/answer', answerController.getAnswerWithFilter);
router.get('/answers/:id', answerController.getAnswerById);
router.delete('/answers/:id', answerController.deleteAnswer);
router.patch('/answers/:id', answerController.editAnswer);

//like
router.get('/templates/:id/like', likeController.getLikes);
router.post('/templates/:id/like', likeController.addLike);
router.delete('/templates/:id/like', likeController.removeLike);
//Теги и темы
router.get('/tags', tagsController.getTags);
router.post('/tags', tagsController.createTag);
//Главная страница

//Поиск
router.get('/search', searchController.searchTemplates);
//Файлы

//Языки и темы интерфейса
router.get("/settings/:id", settingsController.getSettings)
router.patch("/settings/:id", settingsController.editSettings)
//Администрирование



//права доступа

module.exports = router;