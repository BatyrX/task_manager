const userService = require("../service/user-services");
const {validationResult} = require('express-validator');
class UserControllers {
    async registration(req, res, next) {
        try {
            const err = validationResult(req);
         if (!err.isEmpty()) {
         return  res.status(400).json({ message: 'Неправильные введенные данные' });
  }
            const { username, email, password } = req.body;
            const tokensAndUser = await userService.registration(username, email, password);
            res.cookie('refreshToken', tokensAndUser.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json({...tokensAndUser, message: 'User created'});
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req, res, next) {
        try {
            const err = validationResult(req);
            if (!err.isEmpty()) {
            return  res.status(400).json({ message: 'Неправильные введенные данные' });
        } 
            const { email, password } = req.body;
            const tokensAndUser = await userService.login(email, password);
            res.cookie('refreshToken', tokensAndUser.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(tokensAndUser);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new UserControllers();