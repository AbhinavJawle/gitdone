import { ProjectManager } from './projectManager.js';
import { TodoItem } from './todoItem.js';

export class DOMManager {
    constructor() {
        this.projectManager = new ProjectManager();
        this.initEventListeners();
        this.renderProjects();
        
        // Render todos for the default project on initial load
        const defaultProject = this.projectManager.getCurrentProject();
        this.renderTodos(defaultProject.id);
    }

    initEventListeners() {
        // Add Project Button and Modal
        const addProjectButton = document.querySelector('.add-project-button');
        const addProjectModal = document.getElementById('add-project-modal');
        const closeProjectModalBtn = addProjectModal.querySelector('.close-modal');
        const addProjectForm = document.getElementById('add-project-form');

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

        newTodoButton.addEventListener('click', () => {
            addTodoModal.style.display = 'block';
        });

        closeTodoModalBtn.addEventListener('click', () => {
            addTodoModal.style.display = 'none';
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
            
            if (event.target === addProjectModal) {
                addProjectModal.style.display = 'none';
            }
            
            if (event.target === addTodoModal) {
                addTodoModal.style.display = 'none';
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

    showAddTodoModal() {
        // Create a modal or form for adding a new todo
        // This is a simplified version - you'd want a more robust modal in a real app
        const title = prompt('Enter todo title:');
        const description = prompt('Enter todo description:');
        const priority = prompt('Enter priority (low/medium/high):');
        const dueDate = prompt('Enter due date (YYYY-MM-DD):');

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
                <h4>${todo.title}</h4>
                <p>${todo.description || 'No description'}</p>
                <div class="card-actions">
                    <span class="${priorityColor}">⭐ Priority: ${todo.priority}</span>
                    <span>👁️ Due: ${todo.dueDate || 'No due date'}</span>
                </div>
            </div>
            <input type="checkbox" ${todo.isCompleted ? 'checked' : ''}>
        `;

        // Add event listener for checkbox
        const checkbox = card.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            todo.toggleComplete();
        });

        return card;
    }
}