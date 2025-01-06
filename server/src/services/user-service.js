const UserDto = require('../dtos/user-dto.js');
const { User, Answer } = require('../models/index.js');
const TokenSchema = require('../models/token-model.js');
const TokenService = require('./token-service.js');
const ApiError = require('../exceptions/api-error.js');
class UserService {
    async getAllUsers() {
        const users = await User.findAll();
        return users;
    }
    async getUserById(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.BadRequest('User not found');
        }
        return user;
    }

    async editUserById(id, data) {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }
        Object.assign(user, data);
        await user.save();
        return user;
    }

    async toggleBlockUser(userId) {

   const user = await User.findOne({ where: { id: userId } });

   if (!user) {
       throw new Error('User not found');
   }
   user.isBlocked = true;
   await user.save();
   return { message: 'User blocked and tokens deleted successfully' };
    }
    async toggleUnblockUser(userId) {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        user.isBlocked = false;
        await user.save();
        const userDto = new UserDto(user);
        const tokens = TokenService.generateAccessToken({ ...userDto });

        return { ...tokens, user: userDto };

         }

         async deleteUser(userId) {
            console.log("Deleting answers for user:", userId);
            await Answer.destroy({ where: { users_id: userId } });

            console.log("Deleting tokens for user:", userId);
            await TokenSchema.destroy({ where: { user_id: userId } });

            console.log("Deleting user:", userId);
          await User.destroy({ where: { id: userId } });

        }
}


module.exports = new UserService();
