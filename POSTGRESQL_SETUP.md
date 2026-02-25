# Salesforce Interview Q&A Portal - PostgreSQL Setup

## ✅ System is Now Live!

Your Salesforce Interview Q&A Portal is now using **Neon PostgreSQL** as the backend database!

## What's New

### Database Setup ✅
- **PostgreSQL Database:** Neon (Cloud-based)
- **Connection:** Established and tested
- **Schema:** Users & Questions tables created
- **Data:** Persistent across all browsers and devices

### Features

#### Admin Features
- ✅ Login to Admin Dashboard
- ✅ Create new interview questions
- ✅ Edit existing questions
- ✅ Delete questions
- ✅ Search and filter questions
- ✅ View all created questions

#### User Features
- ✅ Register new account
- ✅ Login to User panel
- ✅ View ALL questions created by ANY admin
- ✅ Search and filter questions
- ✅ Read-only access (no edit/delete)

### Key Benefit
**All users see the SAME questions** posted by admins, regardless of browser or device! ✨

## How to Get Started

### 1. Open Application
```
http://localhost:3000
```

### 2. Admin Login
- **Email:** `admin@salesforce.com`
- **Password:** `admin123`
- Click "Enter Admin Panel"

### 3. Add Your First Question
1. Fill in: Question, Answer, Category
2. Click "Add Question"
3. Question is **immediately saved to PostgreSQL**

### 4. User Login
1. Click "Enter User Mode"
2. Register a new account OR login with existing
3. **See ALL questions posted by admins!** ✅

## Architecture

```
Browser → Express Server (Node.js) → Neon PostgreSQL
                                      ├─ Users Table
                                      └─ Questions Table
```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user'  -- 'admin' or 'user'
);
```

#### Questions Table
```sql
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question TEXT,
    answer TEXT,
    category VARCHAR(100),
    created_by INTEGER (FK to users.id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Questions (All users can view)
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get single question

### Admin Only
- `POST /api/questions` - Create question (requires adminId)
- `PUT /api/questions/:id` - Update question (requires adminId)
- `DELETE /api/questions/:id` - Delete question (requires adminId)

### Admin Management
- `GET /api/admins` - Get all admins
- `GET /api/questions/by-admin/:adminId` - Get questions by specific admin

## Starting the Server

### First Time Setup
```bash
npm install
npm run setup-db
npm start
```

### Regular Startup
```bash
npm start
```

Server runs on: `http://localhost:3000`

## File Structure

```
AI Website/
├── server.js                    (PostgreSQL-powered backend)
├── .env                        (Database connection)
├── setup-db.js                 (Database initialization)
├── package.json                (Dependencies)
├── index.html                  (Home page)
├── pages/
│   ├── admin.html
│   ├── admin-login.html
│   ├── user.html
│   └── user-login.html
└── scripts/
    ├── admin-script.js         (Admin dashboard)
    ├── admin-login-script.js   (Admin auth)
    ├── user-script.js          (User dashboard)
    └── user-login-script.js    (User auth)
```

## Testing

Run the test to verify everything works:
```bash
node test-db.js
```

Expected output:
```
✅ Question Added Successfully!
✅ Questions Retrieved!
🎉 SUCCESS! User can see admin question!
```

## Troubleshooting

### Server won't start
1. Check if port 3000 is available
2. Verify Node.js is installed: `node --version`
3. Check .env file exists with DATABASE_URL

### Can't connect to database
1. Verify Neon database is online
2. Check .env file has correct DATABASE_URL
3. Run: `npm run setup-db` to reinitialize

### Users don't see questions
1. Ensure admin added questions (check in Admin panel)
2. Refresh browser page (hard refresh: Ctrl+Shift+R)
3. Check browser console for errors (F12)
4. Verify server is running

### Forgot admin password
Reset the database:
```bash
npm run setup-db
```
This resets everything to defaults.

## Security Notes

⚠️ **Current State:** Demo/Development
- Passwords are Base64 encoded (for demo only)
- Use `bcryptjs` for production
- Add JWT tokens for session management
- Never expose DATABASE_URL in frontend

## Production Checklist

- [ ] Use bcryptjs for password hashing
- [ ] Implement JWT authentication
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Add input validation
- [ ] Implement user roles properly
- [ ] Add audit logging
- [ ] Set up backups

## Support

If something isn't working:
1. Check server console for errors
2. Check browser console (F12)
3. Verify database connection: `npm run setup-db`
4. Restart server: `npm start`

---

**Happy Learning! 🚀**
