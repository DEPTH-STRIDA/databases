-- Создание таблицы преподавателей
CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    department TEXT NOT NULL,
    experience INTEGER NOT NULL,
    hire_date DATETIME NOT NULL,
    is_full_time BOOLEAN NOT NULL
);

-- Добавление поля teacher_id в таблицу lessons
ALTER TABLE lessons ADD COLUMN teacher_id INTEGER REFERENCES teachers(id); 