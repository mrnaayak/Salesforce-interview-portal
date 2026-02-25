// User QA Learning System (Read-Only)
class UserQAManager {
    constructor() {
        // Check if user is logged in
        this.checkAuthentication();
        this.qaList = this.loadFromLocalStorage();
        this.init();
    }

    checkAuthentication() {
        const user = this.getLoggedInUser();
        if (!user) {
            window.location.href = 'user-login.html';
            return;
        }
        // Display user name
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = `Welcome, ${user.name}!`;
        }
    }

    getLoggedInUser() {
        const user = localStorage.getItem('adminUser');
        return user ? JSON.parse(user) : null;
    }

    init() {
        this.attachEventListeners();
        this.renderQAList();
    }

    attachEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const filterCategory = document.getElementById('filterCategory');

        searchInput.addEventListener('input', () => this.filterAndRender());
        filterCategory.addEventListener('change', () => this.filterAndRender());
    }

    // Filter QA based on search and category
    filterAndRender() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('filterCategory').value;

        const filtered = this.qaList.filter(qa => {
            const matchesSearch = qa.question.toLowerCase().includes(searchInput) ||
                                qa.answer.toLowerCase().includes(searchInput);
            const matchesCategory = !categoryFilter || qa.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });

        this.renderQAList(filtered);
    }

    // Render QA List (Read-Only - No Edit/Delete buttons)
    renderQAList(list = this.qaList) {
        const qaListContainer = document.getElementById('qaList');
        const emptyMessage = document.getElementById('emptyMessage');

        qaListContainer.innerHTML = '';

        if (list.length === 0) {
            emptyMessage.style.display = 'block';
            return;
        }

        emptyMessage.style.display = 'none';

        list.forEach(qa => {
            const qaCard = document.createElement('div');
            qaCard.className = 'qa-card';
            qaCard.innerHTML = `
                <div class="qa-header">
                    <div class="qa-title">
                        <div class="qa-question">${this.escapeHtml(qa.question)}</div>
                        <span class="qa-category">${qa.category}</span>
                    </div>
                </div>
                <div class="qa-answer">
                    <strong>Answer:</strong><br>
                    ${this.escapeHtml(qa.answer)}
                </div>
                <small style="color: #999;">Created: ${qa.createdAt}${qa.updatedAt ? ` | Updated: ${qa.updatedAt}` : ''}</small>
            `;
            qaListContainer.appendChild(qaCard);
        });
    }

    // Local Storage Management
    loadFromLocalStorage() {
        const stored = localStorage.getItem('salesforceQA');
        return stored ? JSON.parse(stored) : this.getDefaultQA();
    }

    // Default QA data
    getDefaultQA() {
        return [
            {
                id: 1,
                question: 'What is Salesforce?',
                answer: 'Salesforce is a cloud-based Customer Relationship Management (CRM) platform that helps organizations manage customer interactions, sales processes, and business relationships in real-time.',
                category: 'Configuration',
                createdAt: '01/01/2024'
            },
            {
                id: 2,
                question: 'What is SOQL?',
                answer: 'SOQL (Salesforce Object Query Language) is a query language that allows you to retrieve records from Salesforce using syntax similar to SQL. It can only query one object at a time.',
                category: 'SOQL',
                createdAt: '01/02/2024'
            },
            {
                id: 3,
                question: 'Explain Apex Triggers',
                answer: 'Apex Triggers are pieces of code that execute before or after specific database events on a particular sObject in Salesforce. They can be used to update records, validate data, or perform business logic.',
                category: 'Apex',
                createdAt: '01/03/2024'
            },
            {
                id: 4,
                question: 'What is Lightning Web Components?',
                answer: 'Lightning Web Components (LWC) is a modern web components framework for building fast and scalable web applications using standard JavaScript, HTML, and CSS.',
                category: 'Lightning',
                createdAt: '01/04/2024'
            },
            {
                id: 5,
                question: 'What is the difference between SOQL and SOSL?',
                answer: 'SOQL (Salesforce Object Query Language) searches data in a single sObject, while SOSL (Salesforce Object Search Language) can search for text across multiple fields and objects simultaneously.',
                category: 'SOQL',
                createdAt: '01/05/2024'
            }
        ];
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the User QA Manager when DOM is ready
let userManager;
document.addEventListener('DOMContentLoaded', () => {
    userManager = new UserQAManager();
});
