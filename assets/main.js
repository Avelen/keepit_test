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
        this.uiHandler.form.addEventListener('submit', (event) => this.handleTodoFormSubmit(event));

        this.uiHandler.taskList.addEventListener('click', async (event) => {
            const target = event.target;
        
            if (target.classList.contains('btn-delete')) {
                const taskId = target.dataset.id;
                const taskElement = target.closest('.task-item');
                deletedTask = await this.taskManager.deleteTask(taskId, taskElement);
                // this.
            }
        
            if (target.classList.contains('btn-toggle')) {
                const taskId = target.dataset.id;
                const taskElement = target.closest('.task-item');
                const task = this.taskManager.taskList.find(t => t.id == taskId);
                this.taskManager.toggleTaskStatus(task, taskElement);
            }
        });
    }

    async handleTodoFormSubmit(event) {
        event.preventDefault();
        const userData = this.uiHandler.getFormData();

        if (userData) {
            const newTask = await this.taskManager.addTask({ ...userData, done: false });

            this.uiHandler.clearTodoFormInputs();
            const taskElement = this.uiHandler.addTaskToList(newTask);
            this.attachTaskEventHandlers(taskElement, newTask);
        }
    }

    applyFilters() {
        const filteredTasks = this.filter.filterTasks(this.taskManager.taskList);
        this.uiHandler.buildTaskList(filteredTasks);
    }

    clearFilters() {
        this.filter.clearFilters();
        this.uiHandler.buildTaskList(this.taskList);
    }
}

new TodoApp();