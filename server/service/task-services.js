const Task = require('../models/task-models');

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

    async getTaskById(taskId) {
        const task = await Task.findById(taskId);
        return task;
    }

    async updateTask(taskId, title, dueDate, completed) {
        const task = await Task.findByIdAndUpdate(taskId, { title, dueDate, completed }, { new: true });
        return task;
    }

    async deleteTask(taskId) {
        await Task.findByIdAndDelete(taskId);
    }
}

module.exports = new TaskService();
