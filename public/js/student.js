document.addEventListener('DOMContentLoaded', async () => {
    // Check session and redirect if not student
    try {
        const response = await fetch('/check-session');
        const data = await response.json();
        
        if (!response.ok || data.user?.role !== 'student') {
            window.location.href = '/index.html';
            return;
        }
        
        document.getElementById('usernameDisplay').textContent = data.user.username;
        loadGrades();
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
});

async function loadGrades() {
    try {
        const response = await fetch('/student/grades');
        const grades = await response.json();
        
        const tableBody = document.getElementById('gradesTableBody');
        tableBody.innerHTML = '';
        
        grades.forEach(grade => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${grade.course_name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${grade.grade}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to load grades:', error);
    }
}

async function loadCourses() {
    try {
        const response = await fetch('/student/courses');
        const courses = await response.json();
        
        const tableBody = document.getElementById('coursesTableBody');
        tableBody.innerHTML = '';
        
        courses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.course_name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.credits}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900">Enroll</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to load courses:', error);
    }
}
