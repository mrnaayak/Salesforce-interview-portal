// User QA Learning System - PostgreSQL Version (Read-Only)
class UserQAManager {
    constructor() {
        this.checkAuthentication();
        this.qaList = [];
        this.init();
    }

    checkAuthentication() {
        const user = this.getLoggedInUser();
        if (!user) {
            window.location.href = 'user-login.html';
            return;
        }
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
        this.loadQuestions();
    }

    async loadQuestions() {
        try {
            const response = await fetch('/api/questions');
            console.log('Fetch response status:', response.status);
            
            if (response.ok) {
                this.qaList = await response.json();
                console.log('Questions loaded:', this.qaList.length, 'questions');
                this.renderQAList();
            } else {
                console.error('Failed to load questions. Status:', response.status);
                const errorText = await response.text();
                console.error('Error:', errorText);
            }
        } catch (error) {
            console.error('Failed to load questions:', error);
            console.error('Error details:', error.message);
            this.renderQAList([]);
        }
    }

    attachEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const filterCategory = document.getElementById('filterCategory');

        if (searchInput) searchInput.addEventListener('input', () => this.filterAndRender());
        if (filterCategory) filterCategory.addEventListener('change', () => this.filterAndRender());
    }

    filterAndRender() {
        const searchInput = document.getElementById('searchInput');
        const filterCategory = document.getElementById('filterCategory');

        const searchText = searchInput ? searchInput.value.toLowerCase() : '';
        const categoryFilter = filterCategory ? filterCategory.value : '';

        const filtered = this.qaList.filter(qa => {
            const matchesSearch = qa.question.toLowerCase().includes(searchText) ||
                                qa.answer.toLowerCase().includes(searchText);
            const matchesCategory = !categoryFilter || qa.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });

        this.renderQAList(filtered);
    }

    renderQAList(list = this.qaList) {
        const qaListContainer = document.getElementById('qaList');
        const emptyMessage = document.getElementById('emptyMessage');

        if (!qaListContainer) return;

        qaListContainer.innerHTML = '';

        if (list.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            return;
        }

        if (emptyMessage) emptyMessage.style.display = 'none';

        list.forEach(qa => {
            const qaCard = document.createElement('div');
            qaCard.className = 'qa-card';
            const createdDate = new Date(qa.created_at).toLocaleDateString();
            
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
                <div style="font-size: 0.85em; color: #999;">
                    By: ${qa.created_by_name || 'Admin'} | Created: ${createdDate}
                </div>
            `;
            qaListContainer.appendChild(qaCard);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

let userManager;
document.addEventListener('DOMContentLoaded', () => {
    userManager = new UserQAManager();
});
