// User Authentication System
class UserAuth {
    constructor() {
        this.users = this.loadUsersFromStorage();
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        const loginForm = document.getElementById('userLoginForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    // Handle Login
    handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const loginMessage = document.getElementById('loginMessage');

        if (!email || !password) {
            this.showMessage(loginMessage, 'Please fill all fields', 'error');
            return;
        }

        const user = this.users.find(u => u.email === email);

        if (!user) {
            this.showMessage(loginMessage, 'Email not found. Please check and try again.', 'error');
            return;
        }

        if (!this.verifyPassword(password, user.password)) {
            this.showMessage(loginMessage, 'Invalid password. Please try again.', 'error');
            return;
        }

        // Store the logged-in user
        localStorage.setItem('adminUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        }));

        this.showMessage(loginMessage, 'Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'user.html';
        }, 1000);
    }

    // Simple password verification
    verifyPassword(password, hash) {
        // Use same Base64 hashing as AdminAuth for consistency
        return btoa(password) === hash;
    }

    // Simple hash function - MUST match AdminAuth
    hashPassword(password) {
        return btoa(password); // Base64 encoding
    }

    // Load users from localStorage - use SAME key as AdminAuth
    loadUsersFromStorage() {
        const stored = localStorage.getItem('adminUsers');
        return stored ? JSON.parse(stored) : [];
    }

    // Logout
    static logout() {
        localStorage.removeItem('adminUser');
        window.location.href = 'user-login.html';
    }

    // Show message
    showMessage(element, message, type) {
        element.textContent = message;
        element.className = `message ${type}`;
        element.style.display = 'block';
    }
}

// Initialize User Auth when DOM is ready
let userAuth;
document.addEventListener('DOMContentLoaded', () => {
    userAuth = new UserAuth();
    // Make UserAuth class globally accessible for logout
    window.UserAuth = UserAuth;
});
