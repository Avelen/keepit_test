class UIHandler {
    constructor() {
        this.taskList = this.getEl('task-list');
        this.form = this.getEl('todo-form');

        this.formTitle = this.getEl('title');
        this.formDesc = this.getEl('description');
        this.formDate = this.getEl('due-date');

        this.formTitle.addEventListener('input', (event) => this.removeHTML(event));
        this.formDesc.addEventListener('input', (event) => this.removeHTML(event));
    }

    getEl(id) {
        return document.getElementById(id);
    }

    getFormData() {
        const title = this.formTitle.value;
        const description = this.formDesc.value;
        const dueDate = this.formDate.value;

        if (!title && !dueDate) return this.showValidationError();

        return {
            title,
            description,
            dueDate,
        }
    }

    removeHTML(event) {
        const tagRegex = /(<([^>]+)>)/gi;
        let clearValue = event.target.value;

        if (clearValue.match(tagRegex)) {
            alert('HTML tags is not allowed');
            clearValue = clearValue.replace(tagRegex, '');
            return event.target.value = clearValue;
        }

        return true;
    }

    buildTaskList(tasks) {
        this.taskList.innerHTML = '';

        for (let task of tasks) {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);
        }
    }

    addTaskToList(task) {
        const taskElement = this.createTaskElement(task);
        this.taskList.appendChild(taskElement);
        return taskElement;
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

        return taskElement;
    }

    showValidationError() {
        this.formTitle.classList.add('error');
        this.formDate.classList.add('error');
    }

    clearTodoFormInputs() {
        this.formTitle.value = '';
        this.formDesc.value = '';
        this.formDate.value = '';
    }
}

export default UIHandler;