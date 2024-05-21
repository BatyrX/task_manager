const jwt = require('jsonwebtoken')
const TokenModel = require('../models/token-models')
const {validationResult} = require('express-validator');


class TokenService {
  generateTokens(payload) {
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
      return {
          accessToken,
          refreshToken
      };
  }

  async saveToken(userId, refreshToken) {
      const tokenData = await TokenModel.findOne({ user: userId });
      if (tokenData) {
          tokenData.refreshToken = refreshToken;
          return tokenData.save();
      }

      const token = await TokenModel.create({ user: userId, refreshToken: refreshToken });
      return token;
  }

  async removeToken(refreshToken) {
      const tokenData = await TokenModel.deleteOne({ refreshToken });
      return tokenData;
  }

  async findToken(refreshToken) {
    console.log('Searching for token:', refreshToken);
    const tokenData = await TokenModel.findOne({ refreshToken });
    console.log('Found token:', tokenData);
    return tokenData;
}

  validateRefreshToken(token) {
      try {
          const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
          console.log('decoded token:', decoded);
          return decoded;
      } catch (e) {
          console.log('Ошибка при валидации токена:', e);
          return null;
      }
  }
}

module.exports = new TokenService()