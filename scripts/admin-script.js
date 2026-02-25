// Admin QA Management System - PostgreSQL Version
class AdminQAManager {
    constructor() {
        this.checkAuthentication();
        this.qaList = [];
        this.editingId = null;
        this.currentAdmin = JSON.parse(localStorage.getItem('adminUser'));
        this.init();
    }

    checkAuthentication() {
        const user = this.getLoggedInUser();
        if (!user || user.role !== 'admin') {
            window.location.href = 'admin-login.html';
            return;
        }
        const adminNameElement = document.getElementById('adminName');
        if (adminNameElement) {
            adminNameElement.textContent = `Welcome, ${user.name}!`;
        }
    }

    getLoggedInUser() {
        const user = localStorage.getItem('adminUser');
        return user ? JSON.parse(user) : null;
    }

    async init() {
        this.attachEventListeners();
        await this.loadQuestions();
        this.renderQAList();
    }

    async loadQuestions() {
        try {
            const response = await fetch('/api/questions');
            if (response.ok) {
                this.qaList = await response.json();
            }
        } catch (error) {
            console.error('Failed to load questions:', error);
            alert('Failed to load questions from server');
        }
    }

    attachEventListeners() {
        const form = document.getElementById('qaForm');
        const searchInput = document.getElementById('searchInput');
        const filterCategory = document.getElementById('filterCategory');
        const cancelBtn = document.getElementById('cancelBtn');

        if (form) form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        if (searchInput) searchInput.addEventListener('input', () => this.filterAndRender());
        if (filterCategory) filterCategory.addEventListener('change', () => this.filterAndRender());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.cancelEdit());
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const questionInput = document.getElementById('questionInput');
        const answerInput = document.getElementById('answerInput');
        const categoryInput = document.getElementById('categoryInput');

        const question = questionInput.value.trim();
        const answer = answerInput.value.trim();
        const category = categoryInput.value;

        if (!question || !answer || !category) {
            alert('Please fill all fields');
            return;
        }

        if (this.editingId) {
            await this.updateQA(this.editingId, question, answer, category);
        } else {
            await this.addQA(question, answer, category);
        }

        this.resetForm();
    }

    async addQA(question, answer, category) {
        try {
            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    answer,
                    category,
                    adminId: this.currentAdmin.id
                })
            });

            if (response.ok) {
                await this.loadQuestions();
                this.renderQAList();
                alert('Question added successfully!');
            } else {
                const error = await response.json();
                alert('Failed: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    async updateQA(id, question, answer, category) {
        try {
            const response = await fetch(`/api/questions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    answer,
                    category,
                    adminId: this.currentAdmin.id
                })
            });

            if (response.ok) {
                await this.loadQuestions();
                this.renderQAList();
                alert('Question updated successfully!');
            } else {
                const error = await response.json();
                alert('Failed: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    async deleteQA(id) {
        if (confirm('Delete this question?')) {
            try {
                const response = await fetch(`/api/questions/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        adminId: this.currentAdmin.id
                    })
                });

                if (response.ok) {
                    await this.loadQuestions();
                    this.renderQAList();
                    alert('Question deleted successfully!');
                } else {
                    const error = await response.json();
                    alert('Failed: ' + (error.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error: ' + error.message);
            }
        }
    }

    editQA(id) {
        const qa = this.qaList.find(q => q.id === id);
        if (qa) {
            this.editingId = id;
            document.getElementById('questionInput').value = qa.question;
            document.getElementById('answerInput').value = qa.answer;
            document.getElementById('categoryInput').value = qa.category;
            document.getElementById('submitBtn').textContent = 'Update Question';
            document.getElementById('cancelBtn').style.display = 'inline-block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    cancelEdit() {
        this.editingId = null;
        this.resetForm();
    }

    resetForm() {
        document.getElementById('qaForm').reset();
        document.getElementById('submitBtn').textContent = 'Add Question';
        document.getElementById('cancelBtn').style.display = 'none';
        this.editingId = null;
    }

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
            const createdDate = new Date(qa.created_at).toLocaleDateString();
            const updateStr = qa.updated_at ? ` | Updated: ${new Date(qa.updated_at).toLocaleDateString()}` : '';
            
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
                <div style="font-size: 0.85em; color: #666; margin: 10px 0;">
                    By: ${qa.created_by_name || 'Admin'} | Created: ${createdDate}${updateStr}
                </div>
                <div class="qa-actions">
                    <button class="btn btn-edit" onclick="adminManager.editQA(${qa.id})">✏️ Edit</button>
                    <button class="btn btn-delete" onclick="adminManager.deleteQA(${qa.id})">🗑️ Delete</button>
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

class AdminAuth {
    static logout() {
        localStorage.removeItem('adminUser');
        window.location.href = 'admin-login.html';
    }
}

let adminManager;
document.addEventListener('DOMContentLoaded', () => {
    adminManager = new AdminQAManager();
});
