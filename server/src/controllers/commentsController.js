const { Template, User, Tag, Question, Answer } = require("../models/index");
const CommentsService = require('../services/comments-service');
const jwt = require('jsonwebtoken');
const tokenService = require('../services/token-service.js');

class CommentsController {
  static async getCommentsByTemplates(req, res, next) {
    const { id: templateId } = req.params;
    try {
      const comments = await CommentsService.getCommentsByTemplates(templateId);
      res.status(comments.status).json(comments.json);
    } catch (error) {
      next(error);
    }
  }

  static async getCommentsByUsers(req, res, next) {
    const { id: userId } = req.params;
    try {
      const comments = await CommentsService.getCommentsByUsers(userId);
      res.status(comments.status).json(comments.json);
    } catch (error) {
      next(error);
    }
  }

  static async addComment(req, res, next) {
    const { id: templateId } = req.params;
    const { newComment: content } = req.body;
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userData = tokenService.validateAccessToken(accessToken);
    const userId = userData.id;

    if (!content) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    try {
      const comments = await CommentsService.addComments(content, templateId, userId);
      res.status(comments.status).json(comments.json);
    } catch (error) {
      next(error);
    }
  }

  static async deleteComment(req, res, next) {
    const { id: commentId } = req.params;
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userData = tokenService.validateAccessToken(accessToken);
    const userId = userData.id;

    try {
      const response = await CommentsService.deleteComment(commentId, userId);
      res.status(response.status).json(response.json);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CommentsController;
