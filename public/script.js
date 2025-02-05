document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskForm = document.getElementById('todo-form');
    const taskList = document.getElementById('task-list');

    let editingTaskId = null; // Variable to track the task being edited

    // Function to render tasks
    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.text;
            li.classList.add('task');

            if (task.completed) {
                li.classList.add('completed');
            }

            // Delete button (Recycle Bin Icon)
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => {
                deleteTask(task.id);
            });

            // Edit button (Pen Icon)
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fas fa-pen"></i>';
            editButton.classList.add('edit-btn');
            editButton.addEventListener('click', () => {
                editTask(task.id, task.text);
            });

            // Mark as completed button
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.classList.add('complete-btn');
            completeButton.addEventListener('click', () => {
                toggleCompletion(task.id);
            });

            li.appendChild(completeButton);
            li.appendChild(editButton);
            li.appendChild(deleteButton);

            taskList.appendChild(li);
        });
    }

    // Function to add or update a task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            return;
        }

        if (editingTaskId !== null) {
            // Update existing task
            let tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks = tasks.map(task => {
                if (task.id === editingTaskId) {
                    task.text = taskText;
                }
                return task;
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            editingTaskId = null; // Reset editing state
            taskForm.querySelector('button[type="submit"]').textContent = 'Add Task';
        } else {
            // Add new task
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
            };

            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        renderTasks(JSON.parse(localStorage.getItem('tasks')));
        taskInput.value = '';
    });

    // Function to delete a task
    function deleteTask(id) {
        let tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
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
        renderTasks(tasks);
    }

    // Function to edit a task
    function editTask(id, currentText) {
        editingTaskId = id;
        taskInput.value = currentText;
        taskForm.querySelector('button[type="submit"]').textContent = 'Update Task';
    }

    // Load tasks from local storage on page load
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks(savedTasks);
});
