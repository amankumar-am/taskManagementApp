document.addEventListener('DOMContentLoaded', function () {
    // Load tasks when page loads
    loadTasks();

    // Form submission for new task
    document.getElementById('taskForm').addEventListener('submit', function (e) {
        e.preventDefault();
        addTask();
    });

    // Save edited task
    document.getElementById('saveEditTask').addEventListener('click', function () {
        updateTask();
    });
});

function loadTasks() {
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            const tableBody = document.getElementById('taskTableBody');
            tableBody.innerHTML = '';

            tasks.forEach(task => {
                const row = document.createElement('tr');

                // For mobile responsiveness, we'll add data-label attributes
                row.innerHTML = `
                    <td data-label="Title">${task.title}</td>
                    <td data-label="Description">${task.description || ''}</td>
                    <td data-label="Status">${formatStatus(task.status)}</td>
                    <td data-label="Created">${new Date(task.createdAt).toLocaleString()}</td>
                    <td data-label="Actions">
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${task.id}">Edit</button>
                            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${task.id}">Delete</button>
                        </div>
                    </td>
                `;

                tableBody.appendChild(row);
            });

            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const taskId = this.getAttribute('data-id');
                    openEditModal(taskId);
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const taskId = this.getAttribute('data-id');
                    deleteTask(taskId);
                });
            });
        })
        .catch(error => console.error('Error loading tasks:', error));
}

function formatStatus(status) {
    const statusMap = {
        'TODO': 'To Do',
        'IN_PROGRESS': 'In Progress',
        'DONE': 'Done'
    };
    return statusMap[status] || status;
}

function addTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const status = document.getElementById('status').value;

    const task = {
        title,
        description,
        status
    };

    fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
        .then(response => response.json())
        .then(() => {
            // Clear form and reload tasks
            document.getElementById('taskForm').reset();
            loadTasks();
        })
        .catch(error => console.error('Error adding task:', error));
}

function openEditModal(taskId) {
    fetch(`/api/tasks/${taskId}`)
        .then(response => response.json())
        .then(task => {
            document.getElementById('editTaskId').value = task.id;
            document.getElementById('editTitle').value = task.title;
            document.getElementById('editDescription').value = task.description || '';
            document.getElementById('editStatus').value = task.status;

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
            modal.show();
        })
        .catch(error => console.error('Error fetching task:', error));
}

function updateTask() {
    const taskId = document.getElementById('editTaskId').value;
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value;
    const status = document.getElementById('editStatus').value;

    const task = {
        title,
        description,
        status
    };

    fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
        .then(response => {
            if (response.ok) {
                // Close modal and reload tasks
                const modal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
                modal.hide();
                loadTasks();
            }
        })
        .catch(error => console.error('Error updating task:', error));
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        })
            .then(() => {
                loadTasks();
            })
            .catch(error => console.error('Error deleting task:', error));
    }
}