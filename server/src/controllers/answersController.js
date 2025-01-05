const AnswerService = require("../services/answer-service.js");
const tokenService = require("../services/token-service.js");

class AnswerController {
  static async addAnswer(req, res, next) {
    const { answer, forms_id, questions_id } = req.body;
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userData = tokenService.validateAccessToken(accessToken);
    const users_id = userData.id;

    if (!answer || !forms_id || !questions_id || !users_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const answerCreater = await AnswerService.createAnswer(answer, forms_id, questions_id, users_id);
      res.status(answerCreater.status).json(answerCreater.json);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAnswerById(req, res, next) {
    const id = req.params.id;
    try {
      const answerGet = await AnswerService.getAnswerById(id);
      res.status(answerGet.status).json(answerGet.json);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAnswerWithFilter(req, res, next) {
    const { forms_id, questions_id } = req.query;
    const whereClause = {};
    if (forms_id) whereClause.forms_id = forms_id;
    if (questions_id) whereClause.questions_id = questions_id;

    try {
      const answerGetFilter = await AnswerService.getAnswerByFilter(whereClause);
      res.status(answerGetFilter.status).json(answerGetFilter.json);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async editAnswer(req, res, next) {
    const id = req.params.id;
    const { answer, questions_id } = req.body;
    try {
      const answerf = await AnswerService.patch(id, answer, questions_id);
      res.status(answerf.status).json(answerf.json);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteAnswer(req, res, next) {
    const id = req.params.id;
    try {
      const answerf = await AnswerService.deleteAnswer(id);
      res.status(answerf.status).json(answerf.json);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = AnswerController;
