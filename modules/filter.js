class Filter {
    constructor(uiHandler) {
        this.UIHandler = uiHandler;
        this.filterTitle = this.UIHandler.getEl('filter-title');
        this.filterDate = this.UIHandler.getEl('filter-date');

        this.UIHandler.getEl('filter-btn').addEventListener('click', () => this.applyFilters());
        this.UIHandler.getEl('clear-filter-btn').addEventListener('click', () => this.clearFilters());
    }
    
    filterTasks(tasks) {
        const title = tasks.title.toLowerCase();
        return tasks.filter(task => {
            const matchesTitle = task.title.toLowerCase().includes(title);
            const matchesDate = filterDate ? task.dueDate === filterDate : true;
            return matchesTitle && matchesDate;
        });
    }

    clearFilters() {
        this.filterTitle.value = '';
        this.filterDate.value = '';
    }
}

export default Filter;