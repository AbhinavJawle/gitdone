import "./styles.css";

(function todo() {
    const projects = [
        //defualt project
        {name: '🏠 Project-1'},

        {name: '🏠 Project-2'},

        //more project here
    ]

    const displayProject = () => {
        const projectList = document.querySelector('.project-list');
        projects.forEach((project) => {
            const newProjectLink = document.createElement('li');
            newProjectLink.textContent = project.name;
            newProjectLink.classList.add('menu-item');
            newProjectLink.classList.add('project-item');
            projectList.appendChild(newProjectLink);
            console.log('displayed')
        });
    }

    const createTodo = (title, description, priority, dueTime, isChecked) => {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueTime = dueTime;
        this.isChecked = isChecked;
    }
    displayProject();
})();