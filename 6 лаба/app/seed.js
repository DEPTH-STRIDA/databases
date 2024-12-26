const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456',
    port: 5432,
});

// Функция для инициализации базы данных
async function initDatabase() {
    try {
        // Создаем базу данных school (если не существует)
        await pool.query(`
            CREATE DATABASE school;
        `).catch(() => console.log('База данных уже существует'));

        // Подключаемся к базе school
        await pool.end();
        const schoolPool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'school',
            password: '123456',
            port: 5432,
        });

        // Удаляем таблицы если существуют и создаем заново
        await schoolPool.query(`
            DROP TABLE IF EXISTS lessons;
            DROP TABLE IF EXISTS teachers;

            CREATE TABLE teachers (
                id UUID PRIMARY KEY,
                full_name TEXT NOT NULL,
                department TEXT NOT NULL,
                experience INTEGER,
                hire_date TIMESTAMP,
                is_full_time BOOLEAN
            );

            CREATE TABLE lessons (
                id UUID PRIMARY KEY,
                date_time TIMESTAMP,
                subject TEXT,
                teacher_id UUID REFERENCES teachers(id),
                teacher_name TEXT,
                lesson_number TEXT,
                student_count INTEGER
            );

            CREATE INDEX idx_teachers_department ON teachers(department);
            CREATE INDEX idx_lessons_subject ON lessons(subject);
            CREATE INDEX idx_lessons_teacher ON lessons(teacher_id);
        `);

        return schoolPool;
    } catch (err) {
        console.error('Ошибка при инициализации базы данных:', err);
        throw err;
    }
}

// Тестовые данные
const departments = ['Математика', 'Физика', 'История', 'Информатика', 'Литература'];
const teachers = [];

// Функция для генерации случайной даты
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Функция для вставки преподавателей
async function insertTeachers(pool) {
    for (let i = 0; i < 10; i++) {
        const teacher = {
            id: uuidv4(),
            full_name: `Преподаватель_${i + 1}`,
            department: departments[Math.floor(Math.random() * departments.length)],
            experience: 1 + Math.floor(Math.random() * 20),
            hire_date: randomDate(new Date(2010, 0, 1), new Date()),
            is_full_time: Math.random() > 0.3
        };
        teachers.push(teacher);

        await pool.query(
            'INSERT INTO teachers (id, full_name, department, experience, hire_date, is_full_time) VALUES ($1, $2, $3, $4, $5, $6)',
            [teacher.id, teacher.full_name, teacher.department, teacher.experience, teacher.hire_date, teacher.is_full_time]
        );
    }
}

// Функция для вставки уроков
async function insertLessons(pool) {
    for (let i = 0; i < 25; i++) {
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];
        const lesson = {
            id: uuidv4(),
            date_time: randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
            subject: teacher.department,
            teacher_id: teacher.id,
            teacher_name: teacher.full_name,
            lesson_number: `${Math.floor(Math.random() * 8) + 1}`,
            student_count: 15 + Math.floor(Math.random() * 15)
        };

        await pool.query(
            'INSERT INTO lessons (id, date_time, subject, teacher_id, teacher_name, lesson_number, student_count) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [lesson.id, lesson.date_time, lesson.subject, lesson.teacher_id, lesson.teacher_name, lesson.lesson_number, lesson.student_count]
        );
    }
}

// Основная функция заполнения БД
async function seedDatabase() {
    let currentPool;
    try {
        console.log('Инициализация базы данных...');
        currentPool = await initDatabase();
        
        console.log('Добавление преподавателей...');
        await insertTeachers(currentPool);
        
        console.log('Добавление уроков...');
        await insertLessons(currentPool);
        
        console.log('База данных успешно заполнена!');
    } catch (err) {
        console.error('Ошибка:', err);
    } finally {
        if (currentPool) {
            await currentPool.end();
        }
    }
}

// Запуск
seedDatabase(); 