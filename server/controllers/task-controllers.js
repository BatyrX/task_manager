const taskService = require('../service/task-services');

class TaskController {
    async createTask(req, res, next) {
        try {
            const { userId, title, dueDate } = req.body;
            if (!userId || !title || !dueDate) {
                return res.status(400).json({ error: 'User ID, title, and due date are required' });
            }
            const task = await taskService.createTask(userId, title, dueDate);
            return res.status(201).json(task);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getTasks(req, res, next) {
        try {
            const { userId } = req.user._id;
            const tasks = await taskService.getTasksByUser(userId);
            return res.json(tasks);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateTask(req, res, next) {  
        try {
            const { userId } = req.userId;
            const { taskId, title, dueDate, completed } = req.body;
            const task = await taskService.updateTask(taskId, title, dueDate, completed);
            return res.json(task);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteTask(req, res, next) {
        try {
            const { userId } = req.userId;
            const { taskId } = req.body;
            await taskService.deleteTask(taskId);
            return res.json({ message: 'Task deleted successfully' });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

}

module.exports = new TaskController();
