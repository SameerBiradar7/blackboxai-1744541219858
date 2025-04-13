// Modal handling functions
function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', async () => {
    // Check session and redirect if not admin
    try {
        const response = await fetch('/check-session');
        const data = await response.json();
        
        if (!response.ok || data.user?.role !== 'admin') {
            window.location.href = '/index.html';
            return;
        }
        
        document.getElementById('usernameDisplay').textContent = data.user.username;
        loadUsers();
        loadCourses();
    } catch (error) {
        console.error('Session check failed:', error);
        window.location.href = '/index.html';
    }

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', { method: 'POST' });
            if (response.ok) {
                window.location.href = '/index.html';
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    });

    // Modal event listeners
    document.getElementById('addUserBtn').addEventListener('click', () => {
        showModal('addUserModal');
    });

    document.getElementById('cancelAddUser').addEventListener('click', () => {
        hideModal('addUserModal');
    });

    document.getElementById('confirmAddUser').addEventListener('click', async () => {
        const form = document.getElementById('addUserForm');
        const formData = new FormData(form);
        const userData = {
            username: formData.get('username'),
            password: formData.get('password'),
            role: formData.get('role')
        };

        // Input validation
        if (!userData.username || !userData.password || !userData.role) {
            alert('Please fill all fields');
            return;
        }

        try {
            const response = await fetch('/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                hideModal('addUserModal');
                form.reset();
                loadUsers(); // Refresh user list
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            alert('An error occurred while adding user');
        }
    });

    // Course modal event listeners
    document.getElementById('addCourseBtn').addEventListener('click', () => {
        showModal('addCourseModal');
    });

    document.getElementById('cancelAddCourse').addEventListener('click', () => {
        hideModal('addCourseModal');
    });

    document.getElementById('confirmAddCourse').addEventListener('click', async () => {
        const form = document.getElementById('addCourseForm');
        const formData = new FormData(form);
        const courseData = {
            course_code: formData.get('code'),
            course_name: formData.get('name'),
            credits: parseInt(formData.get('credits'))
        };

        // Input validation
        if (!courseData.course_code || !courseData.course_name || !courseData.credits) {
            alert('Please fill all fields');
            return;
        }

        try {
            const response = await fetch('/admin/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData)
            });

            if (response.ok) {
                hideModal('addCourseModal');
                form.reset();
                loadCourses(); // Refresh course list
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to add course');
            }
        } catch (error) {
            console.error('Error adding course:', error);
            alert('An error occurred while adding course');
        }
    });
});

async function loadUsers() {
    try {
        const response = await fetch('/admin/users');
        const users = await response.json();
        
        const tableBody = document.getElementById('usersTableBody');
        tableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.username}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.role}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

async function loadCourses() {
    try {
        const response = await fetch('/admin/courses');
        const courses = await response.json();
        
        const tableBody = document.getElementById('coursesTableBody');
        tableBody.innerHTML = '';
        
        courses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.course_code}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.course_name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.credits}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to load courses:', error);
    }
}
