const { Template, User, Tag, Question, Answer } = require("../models/index");
const AnswerService = require("../services/answer-service.js")
exports.addAnswer = async (req, res, next) => {
    const { answer, forms_id, questions_id, users_id } = req.body;

    // Проверка на наличие обязательных данных
    if (!answer || !forms_id || !questions_id || !users_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

  try {
      // Await the async function to ensure it resolves before accessing its properties
      const answerf = await AnswerService.createAnswer(answer, forms_id, questions_id, users_id);

      // Use the resolved status and json properties correctly
      res.status(answerf.status).json(answerf.json);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
};