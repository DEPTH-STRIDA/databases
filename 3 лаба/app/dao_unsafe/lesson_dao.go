package dao_unsafe

import (
	"database/sql"
	"fmt"
	"time"
)

// Lesson структура данных (такая же, как в безопасной версии)
type Lesson struct {
	DateTime     time.Time
	Subject      string
	TeacherID    sql.NullInt64
	TeacherName  string
	LessonNumber string
	StudentCount int
}

// UnsafeLessonDAO реализация с уязвимостями
type UnsafeLessonDAO struct {
	db *sql.DB
}

func NewUnsafeLessonDAO(db *sql.DB) *UnsafeLessonDAO {
	return &UnsafeLessonDAO{db: db}
}

// UnsafeGetBySubject - уязвимый метод с конкатенацией строк
func (dao *UnsafeLessonDAO) UnsafeGetBySubject(subject string) (*Lesson, error) { // Используем локальный тип Lesson
	lesson := &Lesson{}
	query := fmt.Sprintf("SELECT date_time, subject, teacher_id, teacher_name, lesson_number, student_count FROM lessons WHERE subject = '%s'", subject)

	err := dao.db.QueryRow(query).Scan(
		&lesson.DateTime,
		&lesson.Subject,
		&lesson.TeacherID,
		&lesson.TeacherName,
		&lesson.LessonNumber,
		&lesson.StudentCount)
	return lesson, err
}

// UnsafeDelete - уязвимый метод удаления
func (dao *UnsafeLessonDAO) UnsafeDelete(subject string) error {
	// УЯЗВИМОСТЬ: Прямая конкатенация параметра в SQL запрос
	query := fmt.Sprintf("DELETE FROM lessons WHERE subject = '%s'", subject)
	_, err := dao.db.Exec(query)
	return err
}
