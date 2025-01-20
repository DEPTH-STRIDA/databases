package dao

import (
	"database/sql"
	"time"
)

// Lesson структура данных
type Lesson struct {
	DateTime     time.Time
	Subject      string
	TeacherID    sql.NullInt64
	TeacherName  string
	LessonNumber string
	StudentCount int
}

// LessonDAO интерфейс для работы с уроками
type LessonDAO interface {
	Insert(lesson *Lesson) error
	GetBySubject(subject string) (*Lesson, error)
	GetAll() ([]*Lesson, error)
	Update(lesson *Lesson) error
	Delete(subject string) error
}

// SQLiteLessonDAO реализация DAO для SQLite
type SQLiteLessonDAO struct {
	db *sql.DB
}

// NewLessonDAO создает новый экземпляр DAO
func NewLessonDAO(db *sql.DB) LessonDAO {
	return &SQLiteLessonDAO{db: db}
}

// Insert добавляет новый урок
func (dao *SQLiteLessonDAO) Insert(lesson *Lesson) error {
	query := `
	INSERT INTO lessons (date_time, subject, teacher_id, teacher_name, lesson_number, student_count)
	VALUES (?, ?, ?, ?, ?, ?)
	`
	teacherID := sql.NullInt64{
		Int64: int64(lesson.TeacherID.Int64),
		Valid: lesson.TeacherID.Valid,
	}
	_, err := dao.db.Exec(query, lesson.DateTime, lesson.Subject,
		teacherID, lesson.TeacherName, lesson.LessonNumber, lesson.StudentCount)
	return err
}

// GetBySubject получает урок по предмету
func (dao *SQLiteLessonDAO) GetBySubject(subject string) (*Lesson, error) {
	lesson := &Lesson{}
	query := `
	SELECT 
		date_time,
		subject,
		teacher_id,
		teacher_name,
		lesson_number,
		student_count
	FROM lessons 
	WHERE subject = ?
	`
	err := dao.db.QueryRow(query, subject).Scan(
		&lesson.DateTime,
		&lesson.Subject,
		&lesson.TeacherID,
		&lesson.TeacherName,
		&lesson.LessonNumber,
		&lesson.StudentCount)
	if err != nil {
		return nil, err
	}
	return lesson, nil
}

// GetAll получает все уроки
func (dao *SQLiteLessonDAO) GetAll() ([]*Lesson, error) {
	query := `
	SELECT 
		date_time,
		subject,
		teacher_id,
		teacher_name,
		lesson_number,
		student_count
	FROM lessons
	`
	rows, err := dao.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var lessons []*Lesson
	for rows.Next() {
		lesson := &Lesson{}
		err := rows.Scan(
			&lesson.DateTime,
			&lesson.Subject,
			&lesson.TeacherID,
			&lesson.TeacherName,
			&lesson.LessonNumber,
			&lesson.StudentCount)
		if err != nil {
			return nil, err
		}
		lessons = append(lessons, lesson)
	}
	return lessons, nil
}

// Update обновляет данные урока
func (dao *SQLiteLessonDAO) Update(lesson *Lesson) error {
	query := `
	UPDATE lessons 
	SET 
		date_time = ?,
		teacher_id = ?,
		teacher_name = ?,
		lesson_number = ?,
		student_count = ?
	WHERE subject = ?
	`
	_, err := dao.db.Exec(query,
		lesson.DateTime,
		lesson.TeacherID,
		lesson.TeacherName,
		lesson.LessonNumber,
		lesson.StudentCount,
		lesson.Subject)
	return err
}

// Delete удаляет урок
func (dao *SQLiteLessonDAO) Delete(subject string) error {
	query := "DELETE FROM lessons WHERE subject = ?"
	_, err := dao.db.Exec(query, subject)
	return err
}
