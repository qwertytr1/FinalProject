const jwt = require('jsonwebtoken');
const TokenSchema = require('../models/token-model.js');
class TokenService{
    generateAccessToken(payload) {
          const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        return{accessToken}
}
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
    }
}
 validateRefreshToken(token) {
    try {
        const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return userData;
    } catch (e) {
        console.error(e);
        return null;
    }
}
async saveToken(userId, refreshToken) {
    console.log("userId:", userId, "refreshToken:", refreshToken);
    const tokenData = await TokenSchema.findOne({ where: { user_id: userId } });
    if (tokenData) {
        tokenData.refresh_token = refreshToken;
        return tokenData.save();
    }
    const token = await TokenSchema.create({ user_id: userId, refresh_token: refreshToken });
    return token;
}
async findToken(refreshToken) {
    const tokenData = await TokenSchema.findOne({
        where: {
            refresh_token: refreshToken
        }
    });
    return tokenData;
}
}


    module.exports = new TokenService();
