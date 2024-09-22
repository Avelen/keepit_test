class TaskManager {

    constructor(db, filter) {
        this.filter = filter;
        this.db = db;
        this.taskList = [];
    }

    async loadTasks() {
        this.taskList = await this.db.getAllTasks();
        return this.taskList;
    }

    async addTask(newTask) {
        const addedTask = await this.db.addTask(newTask);

        if (addedTask) {
            this.taskList.push(addedTask);
            return addedTask;
        }
    }

    async deleteTask(id, taskElement) {
        if (!confirm('Are you sure you want to delete this task?')) return false;
        await this.db.deleteTask(id);
        return taskElement;
    }

    toggleTaskStatus(task, taskElement) {
        task.done = !task.done;

        this.db.updateTask(task).then(() => {
            const toggleBtn = taskElement.querySelector('.btn-toggle');
            toggleBtn.textContent = task.done ? 'Undo' : 'Done';

            return task.done
                ? taskElement.classList.add('completed')
                : taskElement.classList.remove('completed');
        });
    }
}

export default TaskManager;