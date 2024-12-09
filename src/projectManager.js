// projectManager.js
export class ProjectManager {
    constructor() {
        this.projects = [
            { 
            // Initialize with a default project
                id: 'default', 
                name: 'Default Project', 
                todos: [] 
            }
        ];
        //this.currentProjectId = 'default';
    }

    // Create a new project
    createProject(name) {
        const newProject = {
            id: this.generateUniqueId(),
            name: name,
            todos: []
        };
        this.projects.push(newProject); //******* */
        return newProject;
    }

    // Get all projects
    getAllProjects() { /*********** */
        return this.projects;
    }

    // Get a specific project by ID
    getProjectById(id) {
        return this.projects.find(project => project.id === id);
    }

    // Set current project
    setCurrentProject(projectId) {
        this.currentProjectId = projectId;
    }

    // Get current project
    getCurrentProject() { /********** */
        return this.getProjectById(this.currentProjectId);
    }

    // Generate a unique ID for projects
    generateUniqueId() {
        return 'proj_' + Math.random().toString(36).substr(2, 9);
    }

    // Add a todo to a specific project
    addTodoToProject(projectId, todo) {
        const project = this.getProjectById(projectId);
        if (project) {
            project.todos.push(todo);
        }
    }

    // Remove a todo from a project
    removeTodoFromProject(projectId, todoId) {
        const project = this.getProjectById(projectId);
        if (project) {
            project.todos = project.todos.filter(todo => todo.id !== todoId);
        }
    }
}

