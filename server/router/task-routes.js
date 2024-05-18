const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task-controllers');

router.post('/tasks', taskController.createTask);
router.get('/tasks/user/:userId', taskController.getTasksByUser);

module.exports = router;
