import { ProjectManager } from './projectManager.js';
import { TodoItem } from './todoItem.js';
import './styles.css'

export class DOMManager {
    constructor() {
        this.projectManager = new ProjectManager();
        
        // Load projects first
        const loadedProjects = this.loadProjects();
        
        // If no projects exist, create a default project
        if (loadedProjects.length === 0) {
            this.projectManager.createProject('Default Project');
        }
        
        // Set projects and current project
        this.projectManager.projects = loadedProjects;
        
        // Set the first project as current if not already set
        if (!this.projectManager.currentProjectId && loadedProjects.length > 0) {
            this.projectManager.setCurrentProject(loadedProjects[0].id);
        }
        this.initEventListeners();
        this.renderProjects();
        
        // Render todos for the default project on initial load
        const defaultProject = this.projectManager.getCurrentProject();
        this.renderTodos(defaultProject.id);
    }

    loadProjects() {
        const storedProjects = localStorage.getItem('projects');
        return storedProjects 
            ? JSON.parse(storedProjects) 
            : [];
    }

    saveProject(){
        localStorage.setItem('projects', JSON.stringify(this.projectManager.getAllProjects()))
    }

    initEventListeners() {
        // Add Project Button and Modal
        const addProjectButton = document.querySelector('.add-project-button');
        const addProjectModal = document.getElementById('add-project-modal');
        const closeProjectModalBtn = addProjectModal.querySelector('.close-modal');
        const addProjectForm = document.getElementById('add-project-form');

        const editTodoModal = document.getElementById('edit-todo-modal');
        const closeEditModalBtn = editTodoModal.querySelector('.close-modal');
        const editTodoForm = document.getElementById('edit-todo-form');

        addProjectButton.addEventListener('click', () => {
            addProjectModal.style.display = 'block';
        });

        closeProjectModalBtn.addEventListener('click', () => {
            addProjectModal.style.display = 'none';
        });

        addProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const projectNameInput = document.getElementById('project-name');
            const projectName = projectNameInput.value.trim();

            if (projectName) {
                const newProject = this.projectManager.createProject(projectName);
                this.saveProject()
                this.renderProjects();
                addProjectModal.style.display = 'none';
                projectNameInput.value = ''; // Clear input
            }
        });

        // New Todo Button and Modal
        const newTodoButton = document.querySelector('.btn-new');
        const addTodoModal = document.getElementById('add-todo-modal');
        const closeTodoModalBtn = addTodoModal.querySelector('.close-modal');
        const addTodoForm = document.getElementById('add-todo-form');

        closeEditModalBtn.addEventListener('click', () => {
            editTodoModal.style.display = 'none';
        });

        newTodoButton.addEventListener('click', () => {
            addTodoModal.style.display = 'block';
        });

        closeTodoModalBtn.addEventListener('click', () => {
            addTodoModal.style.display = 'none';
        });

        editTodoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather form data
            const todoId = document.getElementById('edit-todo-id').value;
            const title = document.getElementById('edit-todo-title').value.trim();
            const description = document.getElementById('edit-todo-description').value.trim();
            const priority = document.getElementById('edit-todo-priority').value;
            const dueDate = document.getElementById('edit-todo-due-date').value;

            if (title) {
                const currentProject = this.projectManager.getCurrentProject();
                const todoToEdit = currentProject.todos.find(todo => todo.id === todoId);
                if (todoToEdit) {
                    // Directly update todo properties
                    todoToEdit.title = title;
                    todoToEdit.description = description;
                    todoToEdit.priority = priority;
                    todoToEdit.dueDate = dueDate;
        
                    this.renderTodos(currentProject.id);
                    this.saveProject(); // Save changes to local storage
                    editTodoModal.style.display = 'none';
                }
            }
        });

        addTodoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather form data
            const title = document.getElementById('todo-title').value.trim();
            const description = document.getElementById('todo-description').value.trim();
            const priority = document.getElementById('todo-priority').value;
            const dueDate = document.getElementById('todo-due-date').value;

            if (title) {
                const newTodo = new TodoItem({
                    title,
                    description,
                    priority,
                    dueDate
                });

                // Add to the current project
                const currentProject = this.projectManager.getCurrentProject();
                this.projectManager.addTodoToProject(currentProject.id, newTodo);
                
                this.renderTodos(currentProject.id);
                
                // Close modal and reset form
                addTodoModal.style.display = 'none';
                addTodoForm.reset();
            }
        });

        // Project List Event Delegation
        const projectList = document.querySelector('.project-list');
        projectList.addEventListener('click', (event) => {
            const projectItem = event.target.closest('.project-item');
            if (projectItem) {
                const projectId = projectItem.dataset.projectId;
                this.projectManager.setCurrentProject(projectId);
                this.renderTodos(projectId);
            }
        });

        // Close modals when clicking outside
        window.addEventListener('click', (event) => {
            const addProjectModal = document.getElementById('add-project-modal');
            const addTodoModal = document.getElementById('add-todo-modal');
            const editTodoModal = document.getElementById('edit-todo-modal');
            if (event.target === addProjectModal) {
                addProjectModal.style.display = 'none';
            }
            
            if (event.target === addTodoModal) {
                addTodoModal.style.display = 'none';
            }

            if (event.target === editTodoModal) {
                editTodoModal.style.display = 'none';
            }
        });
    }

    renderProjects() {
        const projectList = document.querySelector('.project-list');
        projectList.innerHTML = ''; // Clear existing projects

        this.projectManager.getAllProjects().forEach(project => {
            const projectElement = document.createElement('li');
            projectElement.textContent = project.name;
            projectElement.classList.add('menu-item', 'project-item');
            projectElement.dataset.projectId = project.id;
            projectList.appendChild(projectElement);
        });
    }

    showAddProjectModal() {
        // Create a simple modal or prompt for adding a new project
        const projectName = prompt('Enter a name for the new project:');
        if (projectName) {
            const newProject = this.projectManager.createProject(projectName);
            this.renderProjects();
        }
    }

    renderTodos(projectId) {
        const project = this.projectManager.getProjectById(projectId);
        const projectsGrid = document.querySelector('.projects-grid');
        projectsGrid.innerHTML = ''; // Clear existing todos

        // Update project name
        const projectNameElement = document.querySelector('.projects-section h3');
        projectNameElement.textContent = project.name;

        project.todos.forEach(todo => {
            const todoCard = this.createTodoCard(todo);
            projectsGrid.appendChild(todoCard);
        });

        this.saveProject();
    }

    createTodoCard(todo) {
        const card = document.createElement('div');
    card.classList.add('project-card');
    card.dataset.todoId = todo.id;
    // Priority color coding
    let priorityColor = '';
    switch(todo.priority) {
        case 'high':
            priorityColor = 'text-red-600';
            break;
        case 'medium':
            priorityColor = 'text-yellow-600';
            break;
        default:
            priorityColor = 'text-green-600';
    }
    card.innerHTML = `
        <div class="project-card-content">
            <div class="todo-content ${todo.isCompleted ? 'completed' : ''}">
                <div class="todo-main-info">
                    <h4>${todo.title}</h4>
                    <p>${todo.description || 'No description'}</p>
                    <div class="card-actions">
                        <span class="${priorityColor}">⭐ Priority: ${todo.priority}</span>
                        <span>👁️ Due: ${todo.dueDate || 'No due date'}</span>
                    </div>
                </div>
                <div class="todo-controls">
                    <input type="checkbox" ${todo.isCompleted ? 'checked' : ''}>
                    <div class="todo-actions">
                        <button class="edit-todo-btn">✏️</button>
                        <button class="delete-todo-btn">🗑️</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    const checkbox = card.querySelector('input[type="checkbox"]');
    const todoContent = card.querySelector('.todo-content');
    checkbox.addEventListener('change', () => {
        const currentProject = this.projectManager.getCurrentProject();
        const todoToUpdate = currentProject.todos.find(t => t.id === todo.id);
       
        if (todoToUpdate) {
            todoToUpdate.isCompleted = checkbox.checked;
            todoContent.classList.toggle('completed', checkbox.checked);
            this.saveProject(); // Explicitly save to localStorage
        }
    });

        const editButton = card.querySelector('.edit-todo-btn');
        editButton.addEventListener('click', () => {
            const editTodoModal = document.getElementById('edit-todo-modal');
            
            // Populate edit modal with current todo details
            document.getElementById('edit-todo-id').value = todo.id;
            document.getElementById('edit-todo-title').value = todo.title;
            document.getElementById('edit-todo-description').value = todo.description;
            document.getElementById('edit-todo-priority').value = todo.priority;
            document.getElementById('edit-todo-due-date').value = todo.dueDate;

            editTodoModal.style.display = 'block';
            this.saveProject();
        });

        // Delete Todo Button
        const deleteButton = card.querySelector('.delete-todo-btn');
        deleteButton.addEventListener('click', () => {
            const currentProject = this.projectManager.getCurrentProject();
            
            // Remove todo from the project
            this.projectManager.removeTodoFromProject(currentProject.id, todo.id);
            this.saveProject();
            // Re-render todos
            this.renderTodos(currentProject.id);
        });

        return card;
    }
}