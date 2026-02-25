-- Salesforce Interview Q&A Portal Database Schema
-- For Neon PostgreSQL

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- 'admin' or 'user'
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

-- Create index for better query performance
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_created_by ON questions(created_by);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Insert default admin user
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@salesforce.com', 'YWRtaW4xMjM=', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert some default questions (optional - can be deleted later)
INSERT INTO questions (question, answer, category, created_by) 
SELECT 
    'What is Salesforce?',
    'Salesforce is a cloud-based Customer Relationship Management (CRM) platform that helps organizations manage customer interactions, sales processes, and business relationships in real-time.',
    'Configuration',
    (SELECT id FROM users WHERE email = 'admin@salesforce.com')
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question = 'What is Salesforce?');

INSERT INTO questions (question, answer, category, created_by) 
SELECT 
    'What is SOQL?',
    'SOQL (Salesforce Object Query Language) is a query language that allows you to retrieve records from Salesforce using syntax similar to SQL. It can only query one object at a time.',
    'SOQL',
    (SELECT id FROM users WHERE email = 'admin@salesforce.com')
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question = 'What is SOQL?');

INSERT INTO questions (question, answer, category, created_by) 
SELECT 
    'Explain Apex Triggers',
    'Apex Triggers are pieces of code that execute before or after specific database events on a particular sObject in Salesforce. They can be used to update records, validate data, or perform business logic.',
    'Apex',
    (SELECT id FROM users WHERE email = 'admin@salesforce.com')
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question = 'Explain Apex Triggers');

INSERT INTO questions (question, answer, category, created_by) 
SELECT 
    'What is Lightning Web Components?',
    'Lightning Web Components (LWC) is a modern web components framework for building fast and scalable web applications using standard JavaScript, HTML, and CSS.',
    'Lightning',
    (SELECT id FROM users WHERE email = 'admin@salesforce.com')
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question = 'What is Lightning Web Components?');

INSERT INTO questions (question, answer, category, created_by) 
SELECT 
    'What is the difference between SOQL and SOSL?',
    'SOQL (Salesforce Object Query Language) searches data in a single sObject, while SOSL (Salesforce Object Search Language) can search for text across multiple fields and objects simultaneously.',
    'SOQL',
    (SELECT id FROM users WHERE email = 'admin@salesforce.com')
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question = 'What is the difference between SOQL and SOSL?');
