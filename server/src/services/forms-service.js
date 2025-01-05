const {Form, User, Template, Question, Answer, TemplatesAccess} = require('../models/index.js');
class FormService {
    async getAllTemplatesWithForms() {
        // Получаем все шаблоны с формами, включая все ответы
        const allTemplates = await Template.findAll({
            include: [
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
                                    attributes: ['id', 'title', 'description', 'type', 'correct_answer'],
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

        if (!allTemplates || allTemplates.length === 0) {
            return { status: 404, json: { error: 'No templates or forms found' } };
        }

        return { status: 200, json: allTemplates };
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