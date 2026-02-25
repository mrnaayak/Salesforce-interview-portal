// Test Script - Admin adds question, User retrieves it
const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(BASE_URL + path);
        
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: body ? JSON.parse(body) : null
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: body
                    });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Starting Test Flow...\n');

    try {
        // Step 1: Admin adds a question
        console.log('📝 Step 1: Admin Adding Question...');
        const newQuestion = {
            question: 'What is a Trigger in Salesforce?',
            answer: 'A Trigger is an Apex code that executes before or after a specific sObject database activity occurs (insert, update, delete, undelete). Triggers can be used to perform custom actions when specific conditions are met.',
            category: 'Apex'
        };

        const addResponse = await makeRequest('POST', '/api/questions', newQuestion);
        
        if (addResponse.status === 201) {
            console.log('✅ Question Added Successfully!');
            console.log('   ID:', addResponse.data.id);
            console.log('   Question:', addResponse.data.question);
            console.log('   Category:', addResponse.data.category);
        } else {
            console.log('❌ Failed to add question:', addResponse);
            return;
        }

        // Step 2: User retrieves all questions
        console.log('\n👤 Step 2: User Retrieving Questions...');
        const getResponse = await makeRequest('GET', '/api/questions');
        
        if (getResponse.status === 200) {
            console.log('✅ Questions Retrieved Successfully!');
            console.log(`   Total Questions: ${getResponse.data.length}`);
            
            // Check if our new question is there
            const found = getResponse.data.find(q => q.question === newQuestion.question);
            
            if (found) {
                console.log('\n🎉 SUCCESS! Question is visible to users!');
                console.log('   Question:', found.question);
                console.log('   Answer:', found.answer);
                console.log('   Category:', found.category);
                console.log('   Created:', found.createdAt);
            } else {
                console.log('\n⚠️  WARNING! Question not found in user list');
                console.log('   All Questions:');
                getResponse.data.forEach((q, i) => {
                    console.log(`   ${i + 1}. ${q.question}`);
                });
            }
        } else {
            console.log('❌ Failed to retrieve questions:', getResponse);
        }

        // Step 3: Display all questions
        console.log('\n📋 Step 3: All Available Questions:');
        const allResponse = await makeRequest('GET', '/api/questions');
        
        if (allResponse.status === 200) {
            console.log(`Found ${allResponse.data.length} questions:\n`);
            allResponse.data.forEach((q, i) => {
                console.log(`${i + 1}. [${q.category}] ${q.question}`);
                console.log(`   Answer: ${q.answer.substring(0, 80)}...`);
                console.log();
            });
        }

    } catch (error) {
        console.error('❌ Error during test:', error.message);
        console.error('\n⚠️  Make sure:');
        console.error('   1. Server is running on http://localhost:3000');
        console.error('   2. Run: npm start (or node server.js)');
    }

    console.log('\n✨ Test Complete!');
}

// Run the tests
runTests();
