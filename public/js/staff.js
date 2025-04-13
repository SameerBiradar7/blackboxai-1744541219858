document.addEventListener('DOMContentLoaded', async () => {
    // Check session and redirect if not staff
    try {
        const response = await fetch('/check-session');
        const data = await response.json();
        
        if (!response.ok || data.user?.role !== 'staff') {
            window.location.href = '/index.html';
            return;
        }
        
        document.getElementById('usernameDisplay').textContent = data.user.username;
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

async function loadCourses() {
    try {
        const response = await fetch('/staff/my-courses');
        const courses = await response.json();
        
        const courseSelect = document.getElementById('courseSelect');
        courseSelect.innerHTML = '<option value="">-- Select a course --</option>';
        
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.course_name;
            courseSelect.appendChild(option);
        });
        
        // Load grades for the first course by default
        if (courses.length > 0) {
            loadGrades(courses[0].id);
        }

        courseSelect.addEventListener('change', (e) => {
            loadGrades(e.target.value);
        });
    } catch (error) {
        console.error('Failed to load courses:', error);
    }
}

async function loadGrades(courseId) {
    try {
        const response = await fetch(`/staff/grades/${courseId}`);
        const grades = await response.json();
        
        const tableBody = document.getElementById('gradesTableBody');
        tableBody.innerHTML = '';
        
        grades.forEach(grade => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${grade.student_id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${grade.student_name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${grade.current_grade}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900">Update</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to load grades:', error);
    }
}
