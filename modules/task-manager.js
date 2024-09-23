class TaskManager {
    constructor(db, filter) {
        this.filter = filter;
        this.db = db;
        this.taskList = [];
    }

    loadTasks = async () => {
        this.taskList = await this.db.getAllTasks();
        return this.taskList;
    }

    addTask = async (newTask) => {
        const addedTask = await this.db.addTask(newTask);

        if (addedTask) {
            this.taskList.push(addedTask);
            return addedTask;
        }
    }

    deleteTask = async (id, taskElement) => {
        const isDelete = await this.db.deleteTask(id);
        if (isDelete) {
            this.taskList = this.taskList.filter((task) => task.id !== id);
            return taskElement;
        }

        return false;
    }

    toggleTaskStatus = async (taskId) => {
        const task = this.taskList.find((task) => task.id === taskId);
        task.done = !task.done;
        const updatedTask = await this.db.updateTask(task);
        return updatedTask ?? false;
    }
}

export default TaskManager;