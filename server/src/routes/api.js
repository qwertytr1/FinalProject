const express = require('express');
const router = express();
const authController = require('../controllers/authController.js');
const userController = require('../controllers/userController.js');
const templatesController = require('../controllers/controller.js');
const searchController = require('../controllers/searchController');
const { body } = require('express-validator');
const commentsController = require('../controllers/commentsController.js');
const authMiddleware = require('../middleware/auth-middleware.js');
const questionController = require('../controllers/questionController.js');
const formsController = require('../controllers/formsController.js')
const answerController = require('../controllers/answersController.js')
const likeController = require('../controllers/likeController.js');
const tagsController = require('../controllers/tagsController.js');
const upload = require('../middleware/upload.js');
const statisticController = require('../controllers/statisticController.js');
const homeController = require('../controllers/mainPageController.js');
const resultController = require('../controllers/resultsController.js')
const SalesforceController = require('../controllers/salesforceController.js');
const { createJiraTicket, getJiraTickets } = require('../controllers/jiraIntegration.js');

router.post('/register', body('email').isEmail(), authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);

router.get('/getUsers', userController.getAllUsers);
router.get('/getUsers/:id?', userController.getUser);
router.put('/user/:id', userController.editUser);
router.post('/user/block/:id', userController.toggleBlockUser);
router.post('/user/unblock/:id', userController.toggleUnblockUser);
router.delete('/users/:id', userController.deleteUser);

router.get('/templates', authMiddleware, templatesController.getTemplates);
router.get('/templates/user',authMiddleware, templatesController.getTemplatesByUser);
router.get('/templates/:id',authMiddleware, templatesController.getTemplateById);
router.post('/templates', upload.single('image'),authMiddleware, templatesController.createTemplate);
router.patch('/templates/:id', templatesController.updateTemplate);
router.delete('/templates/:id', templatesController.deleteTemplate);

router.get('/templates/:id/questions', authMiddleware,questionController.getAllQuestions);
router.post('/templates/:id/questions',authMiddleware, questionController.addQuestions);
router.patch('/templates/:id/questions/:questionId', questionController.editQuestions);
router.delete('/templates/:id/questions/:questionId', questionController.deleteQuestions);

router.get('/templates/:id/comments',authMiddleware, commentsController.getCommentsByTemplates);
router.get('/users/:id/comments',authMiddleware, commentsController.getCommentsByUsers);
router.post('/templates/:id/comments',authMiddleware, commentsController.addComment);
router.delete('/comments/:id',authMiddleware, commentsController.deleteComment);

router.get('/forms',authMiddleware, formsController.getAllForms);
router.get('/forms/:id',authMiddleware, formsController.getFormsById);
router.patch('/forms/:id', formsController.updateForms);
router.post('/forms',formsController.createForms);
router.delete('/forms/:id', formsController.deleteForms);
router.get('/forms/user-templates/:userId', formsController.getFormsByUserTemplates);

router.post('/answer',authMiddleware, answerController.addAnswer);
router.get('/answer', answerController.getAnswerWithFilter);
router.get('/answers/:id', answerController.getAnswerById);
router.delete('/answers/:id', answerController.deleteAnswer);
router.patch('/answers/:id', answerController.editAnswer);

router.get('/templates/:id/like',authMiddleware, likeController.getLikes);
router.post('/templates/:id/like',authMiddleware, likeController.addLike);
router.delete('/templates/:id/like',authMiddleware, likeController.removeLike);

router.get('/tags',authMiddleware, tagsController.getTags);
router.post('/tags', tagsController.createTag);

router.post('/forms/:id/result', resultController.addResults);
router.get('/results', resultController.getAllResults);

router.get("/latest-templates",authMiddleware, homeController.getLatestTemplates);
router.get("/top-templates",authMiddleware, homeController.getTopTemplates);
router.get("/tags-cloud",authMiddleware, homeController.getTagsCloud);

router.get('/search',authMiddleware, searchController.searchTemplates);

router.get('/admin/statistics', statisticController.getStatistics);

router.post('/salesforce/account', SalesforceController.Salesforce);

router.post('/create-jira-ticket', createJiraTicket)
router.get('/tickets', getJiraTickets);

module.exports = router;