import IndexedDB from '../modules/db.js';
import filterTasks from '../modules/filter.js';

class TodoApp {
    taskList = [];

    constructor() {
        this.todoDB = new IndexedDB();
        this.init();
    }

    getEl(id) {
        return document.getElementById(id);
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => this.todoDB.init().then(() => this.getTaskList()));

        this.getEl('todo-form').addEventListener('submit', (event) => this.handleTodoFormSubmit(event));
        this.getEl('filter-btn').addEventListener('click', () => this.applyFilters());
        this.getEl('clear-filter-btn').addEventListener('click', () => this.clearFilters());
    }

    handleTodoFormSubmit(event) {
        event.preventDefault();

        const title = this.getEl('title').value;
        const description = this.getEl('description').value;
        const dueDate = this.getEl('due-date').value;

        if (!title && !dueDate) return this.showValidationError();

        const newTask = { title, description, dueDate, done: false };
        this.todoDB.addTask(newTask).then((addedTask) => {
            this.clearTodoFormInputs();
            this.addTaskToList(addedTask);
        });
    }

    showValidationError() {
        this.getEl('title').classList.add('error');
        this.getEl('due-date').classList.add('error');
    }

    clearTodoFormInputs() {
        this.getEl('title').value = '';
        this.getEl('description').value = '';
        this.getEl('due-date').value = '';
    }

    getTaskList() {
        this.todoDB.getAllTasks().then(tasks => {
            this.taskList = tasks;
            this.buildTaskList(tasks);
        });
    }

    buildTaskList(tasks) {
        const taskList = this.getEl('task-list');
        taskList.innerHTML = '';

        for (let task of tasks) {
            const taskElement = this.createTaskElement(task);
            taskList.appendChild(taskElement);
        }
    }

    createTaskElement(task) {
        const doneBtnName = task.done ? 'Undo' : 'Done';
        const taskElement = document.createElement('div');

        taskElement.setAttribute('data-id', task.id);
        taskElement.classList.add('task-item');
        if (task.done) taskElement.classList.add('completed');


        taskElement.innerHTML = `
            <div class="task-item__body">
                <h4>${task.title}</h4>
                <pre>${task.description}</pre>
                <p>Due Date: ${task.dueDate}</p>
            </div>
            <div class="task-item__btn-group">
                <button class="btn btn-toggle" data-id="${task.id}">${doneBtnName}</button>
                <button class="btn btn-delete" data-id="${task.id}">Delete</button>
            </div>
        `;

        taskElement.querySelector('.btn-delete').addEventListener('click', () => this.deleteTask(task.id, taskElement));
        taskElement.querySelector('.btn-toggle').addEventListener('click', () => this.toggleTaskStatus(task, taskElement));

        return taskElement;
    }

    addTaskToList(task) {
        const taskList = this.getEl('task-list');
        const taskElement = this.createTaskElement(task);
        taskList.appendChild(taskElement);
        this.taskList.push(task);
        console.log(task);
    }

    deleteTask(id, taskElement) {
        this.todoDB.deleteTask(id).then(() => taskElement.remove());
        this.taskList = this.taskList.filter(task => task.id !== id);
    }

    toggleTaskStatus(task, taskElement) {
        task.done = !task.done;

        this.todoDB.updateTask(task).then(() => {
            const toggleBtn = taskElement.querySelector('.btn-toggle');
            toggleBtn.textContent = task.done ? 'Undo' : 'Done';

            return task.done
                ? taskElement.classList.add('completed')
                : taskElement.classList.remove('completed');
        });
    }

    applyFilters() {
        const filterTitle = this.getEl('filter-title').value;
        const filterDate = this.getEl('filter-date').value;
        const tasks = this.taskList;
        const filteredTasks = filterTasks(tasks, filterTitle, filterDate);

        this.buildTaskList(filteredTasks);
    }

    clearFilters() {
        this.getEl('filter-title').value = '';
        this.getEl('filter-date').value = '';

        this.buildTaskList(this.taskList);
    }
}

new TodoApp();