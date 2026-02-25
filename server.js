// Salesforce Interview Q&A Portal - PostgreSQL Backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Create database connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Test database connection
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        console.error('\n⚠️  Make sure to:');
        console.error('   1. Create .env file with DATABASE_URL');
        console.error('   2. Run: npm install');
        console.error('   3. Run: npm run setup-db');
    } else {
        console.log('✅ Connected to Neon PostgreSQL Database');
    }
});

// ==================== AUTHENTICATION ROUTES ====================

// User Registration
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        // Check if user exists
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password (Base64 for demo - use bcrypt in production)
        const hashedPassword = Buffer.from(password).toString('base64');

        // Insert new user
        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, 'user']
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        // Find user
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];
        const hashedPassword = Buffer.from(password).toString('base64');

        // Verify password
        if (user.password !== hashedPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ==================== QUESTION ROUTES ====================

// GET all questions (accessible to users)
app.get('/api/questions', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT q.id, q.question, q.answer, q.category, q.created_at, q.updated_at, u.name as created_by_name
             FROM questions q
             JOIN users u ON q.created_by = u.id
             ORDER BY q.created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// GET single question
app.get('/api/questions/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT q.id, q.question, q.answer, q.category, q.created_at, q.updated_at, u.name as created_by_name
             FROM questions q
             JOIN users u ON q.created_by = u.id
             WHERE q.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Failed to fetch question' });
    }
});

// POST new question (admin only)
app.post('/api/questions', async (req, res) => {
    const { question, answer, category, adminId } = req.body;

    if (!question || !answer || !category || !adminId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Verify user is admin
        const user = await pool.query('SELECT role FROM users WHERE id = $1', [adminId]);
        if (user.rows.length === 0 || user.rows[0].role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can create questions' });
        }

        const result = await pool.query(
            `INSERT INTO questions (question, answer, category, created_by) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [question, answer, category, adminId]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Failed to create question' });
    }
});

// PUT update question (admin only)
app.put('/api/questions/:id', async (req, res) => {
    const { id } = req.params;
    const { question, answer, category, adminId } = req.body;

    if (!question || !answer || !category || !adminId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Verify user is admin
        const user = await pool.query('SELECT role FROM users WHERE id = $1', [adminId]);
        if (user.rows.length === 0 || user.rows[0].role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can update questions' });
        }

        // Check if question exists
        const existing = await pool.query('SELECT created_by FROM questions WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const result = await pool.query(
            `UPDATE questions 
             SET question = $1, answer = $2, category = $3, updated_at = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING *`,
            [question, answer, category, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Failed to update question' });
    }
});

// DELETE question (admin only)
app.delete('/api/questions/:id', async (req, res) => {
    const { id } = req.params;
    const { adminId } = req.body;

    if (!adminId) {
        return res.status(400).json({ error: 'Admin ID required' });
    }

    try {
        // Verify user is admin
        const user = await pool.query('SELECT role FROM users WHERE id = $1', [adminId]);
        if (user.rows.length === 0 || user.rows[0].role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can delete questions' });
        }

        const result = await pool.query(
            'DELETE FROM questions WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json({ message: 'Question deleted successfully', question: result.rows[0] });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

// ==================== ADMIN ROUTES ====================

// GET all admins
app.get('/api/admins', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, created_at FROM users WHERE role = $1 ORDER BY created_at',
            ['admin']
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
});

// GET questions by specific admin
app.get('/api/questions/by-admin/:adminId', async (req, res) => {
    const { adminId } = req.params;

    try {
        const result = await pool.query(
            `SELECT q.id, q.question, q.answer, q.category, q.created_at, q.updated_at
             FROM questions q
             WHERE q.created_by = $1
             ORDER BY q.created_at DESC`,
            [adminId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching admin questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', database: 'PostgreSQL (Neon)' });
});

// Start server
app.listen(PORT, () => {
    console.log('\n🚀 Server running at http://localhost:' + PORT);
    console.log('📊 Using Neon PostgreSQL Database');
    console.log('📋 API Endpoints:');
    console.log('   GET    /api/questions - Get all questions');
    console.log('   POST   /api/questions - Add question (admin only)');
    console.log('   PUT    /api/questions/:id - Update question (admin only)');
    console.log('   DELETE /api/questions/:id - Delete question (admin only)');
    console.log('   POST   /api/auth/register - Register user');
    console.log('   POST   /api/auth/login - Login user');
    console.log('   GET    /api/admins - Get all admins');
    console.log('\n✨ Ready to handle requests!');
});
