document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskForm = document.getElementById('todo-form');
    const taskList = document.getElementById('task-list');

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

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => {
                deleteTask(task.id);
            });

            // Mark as completed button
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.classList.add('complete-btn');
            completeButton.addEventListener('click', () => {
                toggleCompletion(task.id);
            });

            li.appendChild(completeButton);
            li.appendChild(deleteButton);

            taskList.appendChild(li);
        });
    }

    // Function to add a new task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        renderTasks(tasks);
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

    // Load tasks from local storage on page load
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks(savedTasks);
});
