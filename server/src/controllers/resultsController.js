const { Template,Results, User, Tag, Question, Answer, Form } = require("../models/index");
const ResultService = require('../services/results-service.js');
const tokenService = require('../services/token-service.js');
const jwt = require('jsonwebtoken');
exports.addResults = async (req, res, next) => {
    const { id: forms_id } = req.params;
    console.log(forms_id)
    const { score } = req.body;
    console.log(score, forms_id)
    const accessToken = req.headers['authorization']?.split(' ')[1];
    if (!accessToken) {
        throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateAccessToken(accessToken);
    const userId = userData.id;
    console.log(userId)
    try {
        const result = await ResultService.createResult(score,forms_id, userId)
        res.status(result.status).json(result.json);
    }
    catch (error) {
        console.error('Error adding results', error);
        res.status(500).json({ error: 'Internal server error' });
}
}
exports.getAllResults = async (req, res) => {
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
      console.error('Error fetching all results:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };