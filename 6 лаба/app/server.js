const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'school',
    password: '123456',
    port: 5432,
});

app.use(express.static('public'));

// API для получения уроков с фильтрацией
app.get('/api/lessons', async (req, res) => {
    try {
        const { dateRange, subject, teacher } = req.query;
        let query = 'SELECT * FROM lessons';
        const params = [];
        const conditions = [];
        let paramCounter = 1;

        if (dateRange) {
            const [startDate, endDate] = dateRange.split(' to ').map(d => {
                const [day, month, year] = d.split('.');
                return `${year}-${month}-${day}`;
            });
            conditions.push(`date_time >= $${paramCounter} AND date_time <= $${paramCounter + 1}`);
            params.push(startDate, endDate + ' 23:59:59');
            paramCounter += 2;
        }

        if (subject) {
            conditions.push(`subject = $${paramCounter}`);
            params.push(subject);
            paramCounter++;
        }

        if (teacher) {
            conditions.push(`teacher_name = $${paramCounter}`);
            params.push(teacher);
            paramCounter++;
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching lessons:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API для получения списка предметов
app.get('/api/subjects', async (req, res) => {
    try {
        const query = 'SELECT DISTINCT subject FROM lessons';
        const result = await pool.query(query);
        res.json(result.rows.map(row => row.subject));
    } catch (err) {
        console.error('Error fetching subjects:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API для получения списка преподавателей
app.get('/api/teachers', async (req, res) => {
    try {
        const query = 'SELECT DISTINCT teacher_name FROM lessons';
        const result = await pool.query(query);
        res.json(result.rows.map(row => row.teacher_name));
    } catch (err) {
        console.error('Error fetching teachers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});