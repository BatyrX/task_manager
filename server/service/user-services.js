const UserModel = require('../models/user-models');
const bcrypt = require('bcrypt');
const tokenService = require('./token-services');
const UserDto = require('../dtos/user-dto');

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
}
module.exports = new UserService()