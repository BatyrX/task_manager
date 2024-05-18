const Task = require('../models/task-model');

class TaskService {
    async createTask(userId, title, dueDate) {
        const task = new Task({ user: userId, title, dueDate });
        await task.save();
        return task;
    }

    async getTasksByUser(userId) {
        const tasks = await Task.find({ user: userId });
        return tasks;
    }
}

module.exports = new TaskService();
