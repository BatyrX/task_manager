const jwt = require('jsonwebtoken');
const TaskModel = require('../models/task-models');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Нет токена доступа' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await TaskModel.findOne({ _id: decoded._id });
        if (!user) {
            return res.status(401).json({ message: 'Пользователь не найден' });
        }

        req.user = user;
        next();
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Токен истек' });
        } else if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Неверный токен' });
        } else {
            return res.status(401).json({ message: 'Ошибка аутентификации' });
        }
    }
}

module.exports = authenticate;
