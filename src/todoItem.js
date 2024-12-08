// todoItem.js
export class TodoItem {
    constructor({
        title, 
        description = '', 
        priority = 'low', 
        dueDate = null, 
        isCompleted = false
    }) {
        this.id = this.generateUniqueId();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.isCompleted = isCompleted;
    }

    // Generate a unique ID for each todo
    generateUniqueId() {
        return 'todo_' + Math.random().toString(36).substr(2, 9);
    }

    // Toggle completion status
    toggleComplete() {
        this.isCompleted = !this.isCompleted;
    }

    // Update todo details
    update(updateData) {
        Object.keys(updateData).forEach(key => {
            if (this.hasOwnProperty(key)) {
                this[key] = updateData[key];
            }
        });
    }
}