const { Template, User, Tag, Question, Answer} = require("../models/index");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require("../services/user-service");
const { validationResult } = require('express-validator');
const ApiError = require("../exceptions/api-error");

exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Error in validation', errors.array()));
        }
        console.log(req.body);
        const { username, email, password, language, theme, role } = req.body;
        const userData = await userService.register(username, email, password, language, theme, role);
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        return res.status(201).json({
            message: 'User registered successfully.',
            userData,
        });
    } catch (error) {
        next(error)
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await userService.login( email, password);
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        return res.status(201).json({
            message: 'User login successfully.',
            userData,
        });
    } catch (error) {
        next(error)
    }
}
exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const token = await userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.json(token);
    } catch (e) {
        next(e)
}

};
exports.refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const token = await userService.refresh(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        return res.status(201).json({
            message: 'User login successfully.',
            userData,
        });
    } catch (e) {
        next(e)
}

};
exports.me = async (req, res,next) => {
    try {

    } catch (error) {
        next(error)
    }
};
exports.getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        return res.json(users);
    } catch (error) {
        next(error)
    }
};
