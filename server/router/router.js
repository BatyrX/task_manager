const taskRouter = require('./task-routes');
const userRouter = require('./user-routes');

const Router = require('express').Router;
const router = new Router();

router.use('/auth', userRouter);
router.use('/tasks', taskRouter);

module.exports = router