const { Template, Question } = require("../models/index");
const QuestionsDto = require("../dtos/questions-dto");

class QuestionService {
    async GetAllQuestion(templateId) {
        const template = await Template.findByPk(templateId);
        if (!template) {
          return { status: 404, json: { error: 'Template not found' } };
        }

        const questions = await Question.findAll({
          where: { templates_id: templateId },
        });

        if (!questions) {
          return { status: 404, json: { error: 'Questions not found' } };
        }
console.log(questions)
        return { status: 200, json: questions }; // Вернуть массив вопросов напрямую
      }
    async AddQuestion(templateId, type, title, description, order, showInResults, correctAnswer) {
        // Check if the template exists
        const template = await Template.findByPk(templateId);
        if (!template) {
            return { status: 404, json: { error: 'Template not found' } };
        }
        const correct_answer = correctAnswer;
        console.log(correct_answer)
        // Check type limits
        const questionCount = await Question.count({
            where: { templates_id: templateId, type: type }
        });
        if (questionCount >= 4) {
            return { status: 400, json: { error: `Cannot add more than 4 questions of type ${type}` } };
        }

        // Create question
        const question = await Question.create({
            title,
            description,
            type,
            order,
            showInResults,
            templates_id: templateId,
            correct_answer
        });

        const newQuestions = new QuestionsDto(question);
        return { status: 201, json: { ...newQuestions } };
    }
    async editQuestion(id,templateId, type, title, description, order, showInResults, correctAnswer) {
        const template = await Template.findByPk(templateId);
        if (!template) {
            return { status: 404, json: { error: 'Template not found' } };
        }

        // Check if the question exists
        const question = await Question.findOne({
            where: {
                id: id,
                templates_id: templateId,
            },
        });

        if (!question) {
            return { status: 404, json: { error: 'Question not found' } };
        }
        const correct_answer = correctAnswer;
        // Update the question with new values
        const updatedQuestion = await question.update({
            title: title ?? question.title,
            description: description ?? question.description,
            order: order ?? question.order,
            type: type ?? question.type,
            showInResults: showInResults ?? question.showInResults,
            correct_answer: correct_answer ?? question.correct_answer
        });

        return { status: 201, json: { question:updatedQuestion } };
    }
    async deleteQuestion(id,templateId) {
        const template = await Template.findByPk(templateId);
        if (!template) {
            return { status: 404, json: { error: 'Template not found' } };
        }

        // Check if the question exists
        const question = await Question.findOne({
            where: {
                id: id,
                templates_id: templateId,
            },
        });

        if (!question) {
            return { status: 404, json: { error: 'Question not found' } };
        }

        // Update the question with new values
        const deletedQuestion = await question.destroy();

        return { status: 201, json: { question:deletedQuestion } };
    }
}

module.exports = new QuestionService();
