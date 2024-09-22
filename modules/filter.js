function filterTasks(tasks, filterTitle, filterDate) {
    const title = filterTitle.toLowerCase();
    return tasks.filter(task => {
        const matchesTitle = task.title.toLowerCase().includes(title);
        const matchesDate = filterDate ? task.dueDate === filterDate : true;
        return matchesTitle && matchesDate;
    });
}

export default filterTasks;