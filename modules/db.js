class IndexedDB {
    constructor() {
        this.dbName = 'toDoList';
        this.dbVersion = 1;
        this.db = null;
    }

    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error('Database error:', event.target.errorCode);
                reject('Database error');
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                const objectStore = this.db.createObjectStore('toDoList', { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('title', 'title', { unique: false });
                objectStore.createIndex('dueDate', 'dueDate', { unique: false });
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };
        });
    }

    getAllTasks() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['toDoList'], 'readonly');
            const objectStore = transaction.objectStore('toDoList');
            const taskList = [];

            objectStore.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    taskList.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(taskList);
                }
            };

            transaction.onerror = (event) => {
                console.error('Get all tasks error:', event.target.errorCode);
                reject('Failed to retrieve tasks');
            };
        });
    }

    addTask(task) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['toDoList'], 'readwrite');
            const objectStore = transaction.objectStore('toDoList');
            const request = objectStore.add(task);

            request.onsuccess = () => resolve({ ...task, id: request.result });

            request.onerror = (event) => {
                console.error('Add task error:', event.target.errorCode);
                reject('Failed to add task');
            };
        });
    }

    deleteTask(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['toDoList'], 'readwrite');
            const objectStore = transaction.objectStore('toDoList');
            const request = objectStore.delete(id);

            request.onsuccess = () => resolve();

            request.onerror = (event) => {
                console.error('Delete task error:', event.target.errorCode);
                reject('Failed to delete task');
            };
        });
    }

    updateTask(task) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['toDoList'], 'readwrite');
            const objectStore = transaction.objectStore('toDoList');
            const request = objectStore.put(task);

            request.onsuccess = () => resolve(task);

            request.onerror = (event) => {
                console.error('Update task error:', event.target.errorCode);
                reject('Failed to update task');
            };
        });
    }
}

export default IndexedDB;