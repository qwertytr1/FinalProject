const { Results, User, Form, Template, Answer, Question } = require("../models/index");
const ResultService = require('../services/results-service.js');
const tokenService = require('../services/token-service.js');

class ResultController {
  static async addResults(req, res, next) {
    const { id: forms_id } = req.params;
    const { score } = req.body;
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userData = tokenService.validateAccessToken(accessToken);
    const userId = userData.id;

    try {
      const result = await ResultService.createResult(score, forms_id, userId);
      res.status(result.status).json(result.json);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAllResults(req, res) {
    try {
      const results = await Results.findAll({
        include: [
          {
            model: User,
            attributes: ['username', 'email'],
          },
          {
            model: Form,
            include: [
              { model: Template, attributes: ['title', 'description', 'category'] },
              {
                model: Answer,
                include: [
                  { model: Question, attributes: ['title', 'description', 'type', 'correct_answer'] },
                ],
              },
            ],
          },
        ],
      });

      return res.status(200).json({ message: 'All results retrieved successfully', results });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = ResultController;
