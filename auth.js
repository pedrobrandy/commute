// Common authentication functions
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'travel_reservation_homev1.html';
}

// Add user info to navigation if element exists
function updateNavigation() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userInfoElement = document.getElementById('userName');
    const loginBtn = document.querySelector('.login-btn');
    
    if (userInfoElement && loginBtn) {
        if (user) {
            userInfoElement.textContent = `Welcome, ${user.fullName}`;
            loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
            loginBtn.onclick = logout;
        } else {
            userInfoElement.textContent = '';
            loginBtn.innerHTML = '<i class="fas fa-user"></i> Login';
            loginBtn.onclick = () => window.location.href = 'login.html';
        }
    }
}

// Check auth on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
}); 