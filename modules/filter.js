class Filter {
    constructor(uiHandler) {
        this.uiHandler = uiHandler;
        this.filterTitle = this.uiHandler.getEl('filter-title');
        this.filterDate = this.uiHandler.getEl('filter-date');
        this.filterBtn = this.uiHandler.getEl('filter-btn');
        this.clearFilterBtn = this.uiHandler.getEl('clear-filter-btn');
    }
    
    filterTasks(tasks) {
        const title = this.filterTitle.value.toLowerCase();
        return tasks.filter(task => {
            const matchesTitle = task.title.toLowerCase().includes(title);
            const matchesDate = this.filterDate.value ? task.dueDate === this.filterDate.value : true;
            return matchesTitle && matchesDate;
        });
    }

    setBtnListener(filterFn, clearFn) {
        this.filterBtn.addEventListener('click', () => filterFn());
        this.clearFilterBtn.addEventListener('click', () => clearFn());
    }

    clearFilters() {
        this.filterTitle.value = '';
        this.filterDate.value = '';
    }
}

export default Filter;