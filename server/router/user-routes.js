const Router = require('express').Router;
const UserControllers = require('../controllers/user-controllers');     
const router = new Router();


router.post('/registration', UserControllers.registration);
router.post('/login', UserControllers.login);
router.post('/logout', UserControllers.logout);
router.get('/refresh', UserControllers.refresh);
router.get('/users', UserControllers.getUsers);


module.exports = router