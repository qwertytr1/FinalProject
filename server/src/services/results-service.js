const {Form, User, Results} = require('../models/index.js');
class ResultService {

    async createResult ( score, forms_id,userId)  {
        const form = await Form.findOne({ where: { id: forms_id } });
if (!form) {
    throw new Error(`Form with id ${forms_id} does not exist.`);
}
        const result = await Results.create({

            score,
              created_at: new Date(),
              forms_id,
              users_id:userId,
          });
            return { status: 200, json: result };
      };
}
module.exports = new ResultService();