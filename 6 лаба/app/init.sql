CREATE DATABASE school;

\c school;

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