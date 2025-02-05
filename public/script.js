document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskForm = document.getElementById('todo-form');
    const taskList = document.getElementById('task-list');
    const sortByDropdown = document.getElementById('sort-by');

    let editingTaskId = null;

    // Function to render tasks
    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.draggable = true; // Enable drag-and-drop
            li.dataset.id = task.id;

            const taskContent = document.createElement('div');
            taskContent.innerHTML = `
                <span>${task.text}</span>
                <small>${new Date(task.timestamp).toLocaleString()}</small>
            `;
            li.appendChild(taskContent);

            // Buttons container
            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('buttons-container');

            // Complete button (Tick Icon)
            const completeButton = document.createElement('button');
            completeButton.innerHTML = '<i class="fas fa-check"></i>';
            completeButton.classList.add('complete-btn');
            completeButton.addEventListener('click', () => toggleCompletion(task.id));

            // Edit button (Pen Icon)
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fas fa-pen"></i>';
            editButton.classList.add('edit-btn');
            editButton.addEventListener('click', () => editTask(task.id, task.text));

            // Delete button (Recycle Bin Icon)
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => deleteTask(task.id));

            buttonsContainer.appendChild(completeButton);
            buttonsContainer.appendChild(editButton);
            buttonsContainer.appendChild(deleteButton);

            li.appendChild(buttonsContainer);

            taskList.appendChild(li);
        });

        // Add drag-and-drop event listeners
        addDragAndDropListeners();
    }

    // Function to add or update a task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            return;
        }

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Check if task already exists
        if (tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase())) {
            alert('Task already exists!');
            return;
        }

        if (editingTaskId !== null) {
            // Update existing task
            tasks.forEach(task => {
                if (task.id === editingTaskId) {
                    task.text = taskText;
                }
            });
            editingTaskId = null;
            taskForm.querySelector('button[type="submit"]').textContent = 'Add Task';
        } else {
            // Add new task with timestamp
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false,
                timestamp: Date.now()
            };
            tasks.push(newTask);
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(getSortedTasks(tasks));
        taskInput.value = '';
    });

    // Function to delete a task
    function deleteTask(id) {
        let tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(getSortedTasks(tasks));
    }

    // Function to toggle completion status of a task
    function toggleCompletion(id) {
        let tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks = tasks.map(task => {
            if (task.id === id) {
                task.completed = !task.completed;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(getSortedTasks(tasks));
    }

    // Function to edit a task
    function editTask(id, currentText) {
        editingTaskId = id;
        taskInput.value = currentText;
        taskForm.querySelector('button[type="submit"]').textContent = 'Update Task';
    }

    // Sorting dropdown change event
    sortByDropdown.addEventListener('change', () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        renderTasks(getSortedTasks(tasks));
    });

    // Function to get sorted tasks
    function getSortedTasks(tasks) {
        const sortBy = sortByDropdown.value;
        if (sortBy === 'creation-time') {
            return tasks.sort((a, b) => a.timestamp - b.timestamp);
        } else if (sortBy === 'alphabetical') {
            return tasks.sort((a, b) => a.text.localeCompare(b.text));
        }
        return tasks;
    }

    // Drag-and-drop functionality
    function addDragAndDropListeners() {
        const tasks = Array.from(taskList.querySelectorAll('li'));

        tasks.forEach(task => {
            task.addEventListener('dragstart', () => {
                setTimeout(() => task.classList.add('dragging'), 0);
            });

            task.addEventListener('dragend', () => {
                task.classList.remove('dragging');
                saveTaskOrder();
            });
        });

        taskList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const dragging = document.querySelector('.dragging');
            const siblings = Array.from(taskList.querySelectorAll('li:not(.dragging)'));

            let nextSibling = siblings.find(sibling => {
                return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
            });

            taskList.insertBefore(dragging, nextSibling);
        });
    }

    // Save task order after drag-and-drop
    function saveTaskOrder() {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => {
            const id = parseInt(li.dataset.id);
            return JSON.parse(localStorage.getItem('tasks')).find(task => task.id === id);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from local storage on page load
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks(getSortedTasks(savedTasks));
});
