const {Form, User, Answer, Question} = require('../models/index.js');
class AnswerService {
    async createAnswer(answer, forms_id, questions_id, users_id) {
        const question = await Question.findOne({
            where: { id: questions_id },
          });

          if (!question) {
            return { status: 404, json: { error: 'Question not found' } };
          }

          // 2. Сравниваем отправленный ответ с правильным ответом
          const is_correct = question.correct_answer === answer; // сравнение строк
        const newAnswer = await Answer.create({
            answer,
            forms_id,
            questions_id,
            is_correct,
            users_id
})

return { status: 201, json: { ...newAnswer } };
    }
}
module.exports = new AnswerService();