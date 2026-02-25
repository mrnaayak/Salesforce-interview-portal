# Setup Instructions - Salesforce Interview Q&A Portal

## Problem Solved
Your application now uses a **backend server** to store questions centrally, so:
- Admin posts questions to the server
- All users automatically see the same questions regardless of browser/device
- Data persists on the server, not just in local storage

## Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)

## Setup Steps

### 1. Install Dependencies
Open a terminal in the project folder and run:
```bash
npm install
```

This will install:
- **express** - web server framework
- **cors** - enable cross-origin requests
- **nodemon** - auto-restart server on file changes (dev only)

### 2. Start the Server
```bash
npm start
```

Or with auto-reload during development:
```bash
npm run dev
```

You should see:
```
Server running at http://localhost:3000
Visit http://localhost:3000 to access the application
```

### 3. Access the Application
Open your browser and go to:
```
http://localhost:3000
```

## How It Works

### Admin Panel
1. Go to **Admin Dashboard** → **Enter Admin Panel**
2. Login with:
   - Email: `admin@salesforce.com`
   - Password: `admin123`
3. Add/Edit/Delete questions - all changes are saved to the server

### User Panel
1. Go to **User Learning** → **Enter User Mode**
2. Login with any user credentials
3. All questions posted by admin are automatically visible

## Data Storage
- Questions are stored in `data.json` file on the server
- This file is created automatically on first run
- Persists between server restarts

## Key Changes Made

### Modified Files:
1. **admin-script.js** - Now uses `/api/questions` endpoints instead of localStorage
2. **user-script.js** - Now fetches questions from `/api/questions` endpoint

### New Files:
1. **server.js** - Express backend server with API routes
2. **package.json** - Node.js dependencies configuration
3. **data.json** - Auto-generated file storing questions (do not edit manually)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | Get all questions |
| GET | `/api/questions/:id` | Get specific question |
| POST | `/api/questions` | Create new question |
| PUT | `/api/questions/:id` | Update question |
| DELETE | `/api/questions/:id` | Delete question |

## Troubleshooting

### Server won't start
- Make sure port 3000 is not in use
- Check if Node.js is installed: `node --version`

### Can't connect to server
- Ensure the server is running (`npm start`)
- Check browser console for errors (F12)
- Try clearing browser cache

### Questions not appearing for users
- Make sure server is running
- Refresh the page
- Check browser console for network errors

## Next Steps (Optional)

For production deployment, consider:
1. Using a proper database (MongoDB, PostgreSQL, etc.)
2. Adding authentication tokens
3. Using environment variables for configuration
4. Deploying to a cloud service (Heroku, AWS, etc.)
