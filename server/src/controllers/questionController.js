const { Template, User, Tag, Question, Answer } = require("../models/index");
const QuestionService = require("../services/question-service.js")
exports.getAllQuestions = async (req, res, next) => {
  const templateId = req.params.id;

  try {
    const questionResult = await QuestionService.GetAllQuestion(templateId);
    res.status(questionResult.status).json(questionResult.json);
  } catch (error) {
    next(error);
  }
};
exports.addQuestions = async (req, res, next) => {
  const templateId = req.params.id;
  const { title, description, order, type, showInResults, correctAnswer} = req.body;
  const allowedTypes = ['single-line', 'multi-line', 'integer', 'checkbox'];
  if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid question type' });
  }

  try {
      const question = await QuestionService.AddQuestion(templateId, type, title, description, order, showInResults, correctAnswer);
    res.status(question.status).json(question.json);

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.editQuestions = async (req, res, next) => {
  const  templateId  = req.params.id;
  const questionId  = req.params.questionId;

  const { title, description, order, type, showInResults, correctAnswer } = req.body;
  const allowedTypes = ['single-line', 'multi-line', 'integer', 'checkbox'];
  if (type && !allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid question type' });
  }
  try {
    const question = await QuestionService.editQuestion(questionId, templateId, type, title, description, order, showInResults, correctAnswer);
    res.status(question.status).json(question.json);
  } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
}
exports.deleteQuestions = async (req, res, next) => {
  const  templateId  = req.params.id;
  const questionId  = req.params.questionId;

  try {
   await QuestionService.deleteQuestion(questionId, templateId);
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
}
