const UserModel = require('../models/user-models');
const bcrypt = require('bcrypt');
const tokenService = require('./token-services');
const UserDto = require('../dtos/user-dto');
const {validationResult} = require('express-validator');


class UserService {

    async registration(username, email, password) {
        const candidate = await UserModel.findOne({email});

        if (candidate) {
            throw new Error(`Пользователь с почтовым адресом ${email} уже существует`)
        }

        const hashPassword = await bcrypt.hash(password, 3)
        const user = await UserModel.create({username, email, password: hashPassword});

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
      }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw new Error(`Пользователь с почтовым адресом ${email} не найден`)
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw new Error('Неверный пароль')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

async refresh(refreshToken) {
    if (!refreshToken) {
        console.log('Отсутствует токен');
        throw new Error('Неверный токен');
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    if (!userData) {
        console.log('Невалидный refresh token');
        throw new Error('Неверный токен1');
    } else {
        console.log('userData:', userData);
    }

    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!tokenFromDb) {
        console.log('Токен не найден в базе данных');
        throw new Error('Неверный токен2');
    } else {
        console.log('tokenFromDb:', tokenFromDb);
    }

    const user = await UserModel.findById(userData.id);
    if (!user) {
        console.log('Пользователь не найден');
        throw new Error('Пользователь не найден');
    }

    const userDto = { id: user._id, email: user.email };
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
}
}
module.exports = new UserService()