// Database Setup Script - Creates schema and inserts default data
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const schema = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_created_by ON questions(created_by);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
`;

async function setupDatabase() {
    try {
        console.log('🔄 Connecting to Neon Database...');
        await client.connect();
        console.log('✅ Connected to database');

        console.log('📋 Creating schema...');
        await client.query(schema);
        console.log('✅ Schema created/verified');

        // Insert default admin user
        console.log('👤 Inserting default admin user...');
        await client.query(
            `INSERT INTO users (name, email, password, role) 
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (email) DO NOTHING`,
            ['Admin User', 'admin@salesforce.com', 'YWRtaW4xMjM=', 'admin']
        );
        console.log('✅ Admin user ready');

        // Insert default questions
        console.log('📝 Inserting default questions...');
        const adminId = await client.query(
            'SELECT id FROM users WHERE email = $1',
            ['admin@salesforce.com']
        );

        if (adminId.rows.length > 0) {
            const defaultQuestions = [
                {
                    question: 'What is Salesforce?',
                    answer: 'Salesforce is a cloud-based Customer Relationship Management (CRM) platform that helps organizations manage customer interactions, sales processes, and business relationships in real-time.',
                    category: 'Configuration'
                },
                {
                    question: 'What is SOQL?',
                    answer: 'SOQL (Salesforce Object Query Language) is a query language that allows you to retrieve records from Salesforce using syntax similar to SQL. It can only query one object at a time.',
                    category: 'SOQL'
                },
                {
                    question: 'Explain Apex Triggers',
                    answer: 'Apex Triggers are pieces of code that execute before or after specific database events on a particular sObject in Salesforce. They can be used to update records, validate data, or perform business logic.',
                    category: 'Apex'
                },
                {
                    question: 'What is Lightning Web Components?',
                    answer: 'Lightning Web Components (LWC) is a modern web components framework for building fast and scalable web applications using standard JavaScript, HTML, and CSS.',
                    category: 'Lightning'
                },
                {
                    question: 'What is the difference between SOQL and SOSL?',
                    answer: 'SOQL (Salesforce Object Query Language) searches data in a single sObject, while SOSL (Salesforce Object Search Language) can search for text across multiple fields and objects simultaneously.',
                    category: 'SOQL'
                }
            ];

            for (const q of defaultQuestions) {
                await client.query(
                    `INSERT INTO questions (question, answer, category, created_by) 
                     VALUES ($1, $2, $3, $4)
                     ON CONFLICT DO NOTHING`,
                    [q.question, q.answer, q.category, adminId.rows[0].id]
                ).catch(() => {}); // Ignore duplicates
            }
            console.log('✅ Default questions inserted');
        }

        console.log('\n🎉 Database setup complete!');
        console.log('\n📊 Database Info:');
        console.log('   Users table: Ready');
        console.log('   Questions table: Ready');
        console.log('   Admin Email: admin@salesforce.com');
        console.log('   Admin Password: admin123');

    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

setupDatabase();
