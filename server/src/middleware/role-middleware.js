const tokenService = require('../services/token-service');
const ApiError = require('../exceptions/api-error');

module.exports = (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw ApiError.UnauthorizedError('Токен отсутствует');
        }


        let userData;
        try {
            userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            throw ApiError.UnauthorizedError('Невалидный токен');
        }

        const { role } = userData;
        if (role !== 'admin') {
            throw ApiError.BadRequest('У вас нет прав на редактирование');
        }
    } catch (error) {
        next(error);
    }
};