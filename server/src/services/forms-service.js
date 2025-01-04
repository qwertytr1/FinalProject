const {Form, User, Template, Question, Answer, TemplatesAccess} = require('../models/index.js');
class FormService {
    async getAllForms() {
        const allForms = await Form.findAll({
            include: [
                { model: User, attributes: ['id', 'username', 'email'] },
                { model: Template, attributes: ['id', 'title'] },
                {
                    model: Answer,
                    attributes: ['id', 'answer', 'is_correct'],
                    include: [
                        {
                            model: Question,
                            attributes: ['id', 'title', 'description', 'type', 'correct_answer'],
                        },
                    ],
                },
            ],
        });

        if (!allForms || allForms.length === 0) {
            return { status: 404, json: { error: 'Forms not found' } };
        }

        return { status: 200, json: allForms };
    }
    async getFormsByUserTemplates(userId) {
        // Find all templates accessible by the user
        const userTemplates = await Template.findAll({
            include: [
                {
                    model: TemplatesAccess,
                    as: 'templateAccesses',
                    where: { users_id: userId },
                    attributes: [],
                },
                {
                    model: Form,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'username', 'email'],
                        },
                        {
                            model: Answer,
                            include: [
                                {
                                    model: Question,
                                    attributes: ['id', 'title', 'description', 'type'],
                                },
                                {
                                    model: User,
                                    attributes: ['id', 'username', 'email'],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!userTemplates.length) {
            return { status: 404, json: { error: 'No forms found for user-created templates' } };
        }

        return { status: 200, json: userTemplates };
    }
    async getFormsById(id) {
        const form = await Form.findOne({
            where: { id },
            include: [
                { model: User, attributes: ['id', 'username', 'email'] },
                { model: Template, attributes: ['id', 'title'] },
                {
                    model: Answer,
                    attributes: ['id', 'answer', 'is_correct'],
                    include: [
                        {
                            model: Question,
                            attributes: ['id', 'title', 'description', 'type', 'correct_answer'],
                        },
                    ],
                },
            ],
        });

        if (!form) {
            return { status: 404, json: { error: 'Form not found' } };
        }

        return { status: 200, json: form };
    }
    async updateForms(id, formData) {
        const [updated] = await Form.update(formData, {
            where: { id: id },
        });

        if (!updated) {
            return { status: 404, json: { error: 'Form not found' } };
        }

        const updatedForm = await Form.findByPk(id);
        return { status: 200, json: updatedForm };
    }
    async createForms(templates_id, user_id) {
        const newForms = await Form.create({
            submitted_at: new Date(),
            templates_id: templates_id,
            users_id:user_id
          });
          return { status: 200, json: newForms };

    }
    async deleteForms(id) {

      const form = await Form.findByPk(id);

      if (!form) {
        return { status: 404, json: { error: 'Forms not found' } };
      }

      await form.destroy();

        return { status: 204, json: form };
    }
}
module.exports = new FormService();