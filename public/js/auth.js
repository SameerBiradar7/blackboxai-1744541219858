document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Input validation
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }
    if (username.length < 4 || username.length > 20) {
        alert('Username must be between 4-20 characters');
        return;
    }
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Redirect based on user role
            switch(data.user.role) {
                case 'admin':
                    window.location.href = '/admin-dashboard.html';
                    break;
                case 'staff':
                    window.location.href = '/staff-dashboard.html';
                    break;
                case 'student':
                    window.location.href = '/student-dashboard.html';
                    break;
            }
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login');
    }
});
