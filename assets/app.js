import IndexedDB from '../modules/db.js';
import UIHandler from '../modules/ui-handler.js';
import Filter from '../modules/filter.js';
import TaskManager from '../modules/task-manager.js';

class TodoApp {
    constructor() {
        this.todoDB = new IndexedDB();
        this.uiHandler = new UIHandler();
        this.filter = new Filter(this.uiHandler);
        this.taskManager = new TaskManager(this.todoDB, this.filter);
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => this.todoDB.init().then(async () => {
            const tasks = await this.taskManager.loadTasks();
            if (tasks) this.uiHandler.buildTaskList(tasks)
        }));

        this.filter.setBtnListener(this.applyFilters, this.clearFilters);
        this.uiHandler.form.addEventListener('submit', (event) => this.handleTodoFormSubmit(event));
        this.uiHandler.setTaskItemBtnListeners(this.taskManager.toggleTaskStatus, this.taskManager.deleteTask);
    }

    handleTodoFormSubmit = async (event) => {
        event.preventDefault();
        const userData = this.uiHandler.getFormData();

        if (userData) {
            const newTask = await this.taskManager.addTask({ ...userData, done: false });

            this.uiHandler.clearTodoFormInputs();
            this.uiHandler.addTaskToList(newTask);
        }
    }

    applyFilters = () => {
        const filteredTasks = this.filter.filterTasks(this.taskManager.taskList);
        this.uiHandler.buildTaskList(filteredTasks);
    }

    clearFilters = () => {
        this.filter.clearFilters();
        this.uiHandler.buildTaskList(this.taskManager.taskList);
    }
}

new TodoApp();