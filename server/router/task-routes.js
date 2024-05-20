const express = require('express');
const {body} = require('express-validator')
const taskRouter = express.Router();
const taskController = require('../controllers/task-controllers');

taskRouter.post('/tasks', 
    body('title').isString().isLength({min: 4}),
    body('dueDate').isISO8601(),

    taskController.createTask);
taskRouter.get('/tasks/:userId', taskController.getTasksByUser);

module.exports = taskRouter;
//prettier