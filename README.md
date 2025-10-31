# Task Tracker Application

A full-stack task tracking application with smart insights built using React (frontend) and Node.js/Express (backend) with SQLite database.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Initialize the database:

   ```bash
   node seed.js
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```
   The server will start on http://localhost:5000

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The application will open in your default browser at http://localhost:3000

## Features

- Create, read, update, and delete tasks
- Smart insights panel showing task statistics and patterns
- Real-time updates of task status and priority
