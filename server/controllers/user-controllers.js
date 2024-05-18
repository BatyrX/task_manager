const userService = require("../service/user-services");

class UserControllers {
    async registration(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            const tokensAndUser = await userService.registration(email, password);
            res.cookie('refreshToken', tokensAndUser.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(tokensAndUser);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            const tokensAndUser = await userService.login(email, password);
            res.cookie('refreshToken', tokensAndUser.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(tokensAndUser);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: 'Internal server error' });
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
            return res.status(500).json({ error: 'Internal server error' });
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
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getUsers();
            return res.json(users);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new UserControllers();