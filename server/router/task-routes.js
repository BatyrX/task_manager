const express = require('express');
const {body} = require('express-validator')
const taskRouter = express.Router();
const taskController = require('../controllers/task-controllers');
const authenticate = require('../middleware/taskmiddleware');

taskRouter.post('/tasks', 
    body('title').isString().isLength({min: 4}),
    body('dueDate').isISO8601(),
    body('completed').isBoolean(), authenticate,
    taskController.createTask);

taskRouter.get('/',
    body('userId').isMongoId(), authenticate,
taskController.getTasks);

taskRouter.put('/',
    body('taskId').isMongoId(),
    body('title').isString().isLength({min: 4}),
    body('dueDate').isISO8601(),
    body('completed').isBoolean(), authenticate,
taskController.updateTask);

taskRouter.delete('/',
    body('taskId').isMongoId(),
    body('userId').isMongoId(), authenticate,
taskController.deleteTask);


module.exports = taskRouter;
//prettier