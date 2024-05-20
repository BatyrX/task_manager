const Router = require('express').Router;
const {body} = require('express-validator')
const UserControllers = require('../controllers/user-controllers');     
const userRouter = new Router();


userRouter.post('/registration', 
    body('username').isLength({min: 3, max: 16}),
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}), 
UserControllers.registration);
userRouter.post('/login', 
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
UserControllers.login);
userRouter.post('/logout', UserControllers.logout);
userRouter.get('/refresh', UserControllers.refresh);



module.exports = userRouter