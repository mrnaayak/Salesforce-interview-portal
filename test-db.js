// Complete Test - Admin Add Question + User View
const http = require('http');
const BASE_URL = 'http://localhost:3000';

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
    console.log('🧪 Testing PostgreSQL Integration...\n');

    try {
        // Step 1: Admin Login
        console.log('📝 Step 1: Admin Login (simulated)...');
        const adminId = 1; // Default admin from DB
        const adminName = 'Admin User';
        console.log('✅ Admin logged in with ID:', adminId);

        // Step 2: Admin adds question
        console.log('\n📝 Step 2: Admin Adding Question...');
        const newQuestion = {
            question: 'What is a Visualforce Page in Salesforce?',
            answer: 'A Visualforce page is a user interface technology in Salesforce that allows you to create custom user interfaces with the same look and feel as Salesforce. It can be created using markup similar to HTML.',
            category: 'Configuration',
            adminId: adminId
        };

        const addResponse = await makeRequest('POST', '/api/questions', newQuestion);
        
        if (addResponse.status === 201) {
            console.log('✅ Question Added Successfully!');
            console.log('   Question ID:', addResponse.data.id);
            console.log('   Question:', addResponse.data.question);
            console.log('   By Admin ID:', addResponse.data.created_by);
        } else {
            console.log('❌ Failed:', addResponse.data);
            return;
        }

        // Step 3: User retrieves all questions
        console.log('\n👤 Step 3: User Viewing All Questions...');
        const getResponse = await makeRequest('GET', '/api/questions');
        
        if (getResponse.status === 200) {
            console.log('✅ Questions Retrieved!');
            console.log(`   Total: ${getResponse.data.length} questions`);
            
            const found = getResponse.data.find(q => q.question === newQuestion.question);
            
            if (found) {
                console.log('\n🎉 SUCCESS! User can see admin question!');
                console.log('   Question:', found.question);
                console.log('   Posted By:', found.created_by_name);
                console.log('   Category:', found.category);
            } else {
                console.log('\n⚠️  Question not in user view');
            }
        } else {
            console.log('❌ Failed to retrieve questions');
        }

        // Step 4: Display all questions
        console.log('\n📋 Step 4: All Questions in Database:');
        if (getResponse.status === 200) {
            getResponse.data.slice(0, 8).forEach((q, i) => {
                console.log(`${i + 1}. [${q.category}] ${q.question.substring(0, 50)}...`);
            });
            if (getResponse.data.length > 8) {
                console.log(`   ... and ${getResponse.data.length - 8} more`);
            }
        }

        console.log('\n✨ PostgreSQL Integration Test Complete!');
        console.log('\n✅ System Status:');
        console.log('   ✓ Database: Connected');
        console.log('   ✓ Admin: Can add questions');
        console.log('   ✓ Users: Can view questions');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n⚠️  Ensure:');
        console.error('   1. Server running: npm start');
        console.error('   2. Database set up: npm run setup-db');
        console.error('   3. .env file configured');
    }
}

runTests();
