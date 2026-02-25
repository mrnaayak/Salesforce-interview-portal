// QA Management System
class QAManager {
    constructor() {
        this.qaList = this.loadFromLocalStorage();
        this.editingId = null;
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.renderQAList();
    }

    attachEventListeners() {
        const form = document.getElementById('qaForm');
        const searchInput = document.getElementById('searchInput');
        const filterCategory = document.getElementById('filterCategory');
        const cancelBtn = document.getElementById('cancelBtn');

        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        searchInput.addEventListener('input', () => this.filterAndRender());
        filterCategory.addEventListener('change', () => this.filterAndRender());
        cancelBtn.addEventListener('click', () => this.cancelEdit());
    }

    // Add or Update QA
    handleFormSubmit(e) {
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
            // Update existing QA
            this.updateQA(this.editingId, question, answer, category);
        } else {
            // Add new QA
            this.addQA(question, answer, category);
        }

        this.resetForm();
    }

    // CREATE: Add new QA
    addQA(question, answer, category) {
        const newQA = {
            id: Date.now(),
            question,
            answer,
            category,
            createdAt: new Date().toLocaleDateString()
        };

        this.qaList.push(newQA);
        this.saveToLocalStorage();
        this.renderQAList();
        alert('Question added successfully!');
    }

    // UPDATE: Update existing QA
    updateQA(id, question, answer, category) {
        const index = this.qaList.findIndex(qa => qa.id === id);
        if (index !== -1) {
            this.qaList[index] = {
                ...this.qaList[index],
                question,
                answer,
                category,
                updatedAt: new Date().toLocaleDateString()
            };
            this.saveToLocalStorage();
            this.renderQAList();
            alert('Question updated successfully!');
        }
    }

    // DELETE: Remove QA
    deleteQA(id) {
        if (confirm('Are you sure you want to delete this question?')) {
            this.qaList = this.qaList.filter(qa => qa.id !== id);
            this.saveToLocalStorage();
            this.renderQAList();
            alert('Question deleted successfully!');
        }
    }

    // EDIT: Prepare QA for editing
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

    // Cancel editing
    cancelEdit() {
        this.editingId = null;
        this.resetForm();
    }

    // Reset form
    resetForm() {
        document.getElementById('qaForm').reset();
        document.getElementById('submitBtn').textContent = 'Add Question';
        document.getElementById('cancelBtn').style.display = 'none';
        this.editingId = null;
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

    // Render QA List
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
                <div class="qa-actions">
                    <button class="btn btn-edit" onclick="qaManager.editQA(${qa.id})">✏️ Edit</button>
                    <button class="btn btn-delete" onclick="qaManager.deleteQA(${qa.id})">🗑️ Delete</button>
                </div>
            `;
            qaListContainer.appendChild(qaCard);
        });
    }

    // Local Storage Management
    saveToLocalStorage() {
        localStorage.setItem('salesforceQA', JSON.stringify(this.qaList));
    }

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

// Initialize the QA Manager when DOM is ready
let qaManager;
document.addEventListener('DOMContentLoaded', () => {
    qaManager = new QAManager();
});
