// Admin Authentication System
class AdminAuth {
    constructor() {
        this.users = this.loadUsersFromStorage();
        this.init();
        this.createDemoAccount();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        const loginForm = document.getElementById('adminLoginForm');
        const registerForm = document.getElementById('adminRegisterForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    // Create demo account if no users exist
    createDemoAccount() {
        if (this.users.length === 0) {
            this.users.push({
                id: 1,
                name: 'Admin User',
                email: 'admin@salesforce.com',
                password: this.hashPassword('admin123')
            });
            this.saveUsersToStorage();
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
            this.showMessage(loginMessage, 'Email not found', 'error');
            return;
        }

        if (!this.verifyPassword(password, user.password)) {
            this.showMessage(loginMessage, 'Incorrect password', 'error');
            return;
        }

        // Login successful
        this.setLoggedInUser(user);
        this.showMessage(loginMessage, 'Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
    }

    // Handle Register
    handleRegister(e) {
        e.preventDefault();

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirm = document.getElementById('registerConfirm').value;
        const registerMessage = document.getElementById('registerMessage');

        if (!name || !email || !password || !confirm) {
            this.showMessage(registerMessage, 'Please fill all fields', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage(registerMessage, 'Password must be at least 6 characters', 'error');
            return;
        }

        if (password !== confirm) {
            this.showMessage(registerMessage, 'Passwords do not match', 'error');
            return;
        }

        if (this.users.some(u => u.email === email)) {
            this.showMessage(registerMessage, 'Email already registered', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password: this.hashPassword(password)
        };

        this.users.push(newUser);
        this.saveUsersToStorage();

        this.showMessage(registerMessage, 'Registration successful! Please login.', 'success');

        // Clear form and switch to login
        document.getElementById('adminRegisterForm').reset();
        setTimeout(() => {
            switchTab('login');
        }, 1500);
    }

    // Simple password hashing (for demo purposes)
    hashPassword(password) {
        return btoa(password); // Base64 encoding (not secure - use proper hashing in production)
    }

    // Verify password
    verifyPassword(password, hash) {
        return btoa(password) === hash;
    }

    // Set logged-in user
    setLoggedInUser(user) {
        localStorage.setItem('adminUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: 'admin',  // Always admin for this panel
            loginTime: new Date().toISOString()
        }));
    }

    // Get logged-in user
    static getLoggedInUser() {
        const user = localStorage.getItem('adminUser');
        return user ? JSON.parse(user) : null;
    }

    // Logout
    static logout() {
        localStorage.removeItem('adminUser');
        window.location.href = 'admin-login.html';
    }

    // Show message
    showMessage(element, message, type) {
        element.textContent = message;
        element.className = `message ${type}`;
        element.style.display = 'block';
    }

    // Local Storage Management
    saveUsersToStorage() {
        localStorage.setItem('adminUsers', JSON.stringify(this.users));
    }

    loadUsersFromStorage() {
        const stored = localStorage.getItem('adminUsers');
        return stored ? JSON.parse(stored) : [];
    }
}

// Switch between login and register tabs
function switchTab(tab) {
    // Update tabs
    const loginTab = document.querySelectorAll('.auth-tab')[0];
    const registerTab = document.querySelectorAll('.auth-tab')[1];

    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
    } else {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
    }
}

// Initialize authentication system when DOM is ready
let auth;
document.addEventListener('DOMContentLoaded', () => {
    auth = new AdminAuth();
});
