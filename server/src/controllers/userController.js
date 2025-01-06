const userService = require("../services/user-service");
const ApiError = require("../exceptions/api-error");

class UserController {
  static async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req, res, next) {
    try {
      const { id } = req.params;

      if (id) {
        const user = await userService.getUserById(id);
        return res.json(user);
      } else {
        throw ApiError.UnauthorizedError();
      }
    } catch (error) {
      next(error);
    }
  }

  static async editUser(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedUser = await userService.editUserById(id, data);
      return res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async toggleBlockUser(req, res, next) {
    try {
      const userId = req.params.id;
      const status = await userService.toggleBlockUser(userId);
      return res.json(status);
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при блокировке пользователя', error: error.message });
    }
  }

  static async toggleUnblockUser(req, res, next) {
    try {
      const userId = req.params.id;
      const status = await userService.toggleUnblockUser(userId);
      return res.json(status);
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при разблокировке пользователя', error: error.message });
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;
      const accessToken = req.headers['authorization']?.split(' ')[1];
      if (!accessToken) {
        throw ApiError.UnauthorizedError();
      }
      await userService.deleteUser(userId);
      return res.json({ message: 'Пользователь успешно удален' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
