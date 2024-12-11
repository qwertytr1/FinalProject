const tokenService = require('../services/token-service');
const ApiError = require('../exceptions/api-error');

module.exports = (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        if (!userData || userData.role !== 'admin') {
            throw ApiError.BadRequest('У вас нет прав для выполнения этого действия');
        }

        req.user = userData; // Сохраняем данные пользователя для дальнейшего использования
        next();
    } catch (error) {
        next(error);
    }
};