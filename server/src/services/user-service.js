const UserDto = require('../dtos/user-dto.js');
const {User} = require('../models/index.js');
const tokenService = require('../services/token-service');
const TokenService  = require('../services/token-service');
const bcrypt = require('bcrypt');
const ApiError = require('../exceptions/api-error.js');
const { urlencoded } = require('body-parser');
class UserService {
    async register(username, email, password, language, theme, role) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw ApiError.BadRequest('Email is already in use.');
        }

        const newUser = await User.create({
            username,
            email,
            password_hash: hashedPassword,
            language,
            theme,
            role,
        });

        const userDto = new UserDto(newUser);
        const tokens = TokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }
    async login(email, password) {
        // Corrected query with `where` clause
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw ApiError.BadRequest('User not found');
        }

        // Use the correct field for the hashed password
        const isPassEquals = await bcrypt.compare(password, user.password_hash);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Invalid password');
        }

        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }
    async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken);
        return token;
     }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnathorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnathorizedError();
        }
        const user = await User.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };

}

    async getAllUsers() {
        // добавить проверу на админку
        const users = await User.findAll();
        return users;
    }
}


module.exports = new UserService();