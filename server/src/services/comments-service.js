const { Comment, User, Template } = require('../models/index.js');
class CommentsService{
    async getCommentsByTemplates(templateId) {
        const template = await Template.findByPk(templateId);
        const comments = await Comment.findAll({
            where: { templates_id: templateId },
            order: [['created_at', 'ASC']],
        });
        if (!comments) {
            return { status: 404, json: { error: 'No comments found for this template' } };
        }

        return { status: 200, json: comments };
    }
    async getCommentsByUsers(userId) {
        const users = await User.findByPk(userId);
        if (!users) {
            return { status: 404, json: { error: 'Template not found' } };
        }
        const comments = await Comment.findAll({
            where: { users_id: userId },
            order: [['created_at', 'ASC']],
        });
        if (!comments || comments.length === 0) {
            return { status: 404, json: { error: 'No comments found for this template' } };
        }

        return { status: 200, json: comments };
    }
    async addComments(content,templateId, userId) {

  const template = await Template.findByPk(templateId);
  if (!template) {
    return { status: 404, json: { error: 'Template not found' } };
  }

  const comment = await Comment.create({
      content,
      users_id: userId,
    templates_id: templateId,
    created_at: new Date(),
  });
  if (!content || content.length === 0) {
    return { status: 404, json: { error: 'No contente' } };
}
  return { status: 200, json: comment };
    }
    async deleteComment(commentId, userId) {
      const comment = await Comment.findByPk(commentId);

      if (!comment) {
        return { status: 404, json: { error: 'Comment not found' } };
      }
      if (comment.users_id !== userId) {
        return { status: 403, json: { error: 'You are not authorized to delete this comment' } };
      }

      await comment.destroy();

      return { status: 200, json: { message: 'Comment deleted successfully' } };
    }
}
module.exports = new CommentsService();