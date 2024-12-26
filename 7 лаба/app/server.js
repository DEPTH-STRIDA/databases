const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'school_schedule';

app.use(express.static('public'));
app.use(express.json());

let db;

// Подключение к MongoDB
async function connectToMongo() {
    try {
        const client = await MongoClient.connect(url);
        console.log('Connected to MongoDB');
        db = client.db(dbName);
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
}

// API endpoints
app.get('/api/lessons', async (req, res) => {
    try {
        const lessons = await db.collection('lessons').find({}).toArray();
        res.json(lessons);
    } catch (err) {
        console.error('Error fetching lessons:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/teachers', async (req, res) => {
    try {
        const teachers = await db.collection('teachers').find({}).toArray();
        res.json(teachers);
    } catch (err) {
        console.error('Error fetching teachers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/subjects', async (req, res) => {
    try {
        const subjects = await db.collection('lessons').distinct('subject');
        res.json(subjects);
    } catch (err) {
        console.error('Error fetching subjects:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/departments', async (req, res) => {
    try {
        const departments = await db.collection('teachers').distinct('department');
        res.json(departments);
    } catch (err) {
        console.error('Error fetching departments:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/teacher-names', async (req, res) => {
    try {
        const teacherNames = await db.collection('teachers').distinct('full_name');
        res.json(teacherNames);
    } catch (err) {
        console.error('Error fetching teacher names:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Запуск сервера
async function startServer() {
    await connectToMongo();
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

startServer();