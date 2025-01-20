package dao

import (
	"database/sql"
	"time"
)

// Teacher структура данных преподавателя
type Teacher struct {
	ID         int
	FullName   string
	Department string
	Experience int
	HireDate   time.Time
	IsFullTime bool
}

// TeacherDAO интерфейс для работы с преподавателями
type TeacherDAO interface {
	Insert(teacher *Teacher) error
	GetByID(id int) (*Teacher, error)
	GetAll() ([]*Teacher, error)
	Update(teacher *Teacher) error
	Delete(id int) error
	GetTeacherLessons(teacherID int) ([]*Lesson, error)
}

// SQLiteTeacherDAO реализация DAO для SQLite
type SQLiteTeacherDAO struct {
	db *sql.DB
}

// NewTeacherDAO создает новый экземпляр DAO
func NewTeacherDAO(db *sql.DB) TeacherDAO {
	return &SQLiteTeacherDAO{db: db}
}

// Insert добавляет нового преподавателя
func (dao *SQLiteTeacherDAO) Insert(teacher *Teacher) error {
	query := `
	INSERT INTO teachers (full_name, department, experience, hire_date, is_full_time)
	VALUES (?, ?, ?, ?, ?)
	`
	result, err := dao.db.Exec(query, teacher.FullName, teacher.Department,
		teacher.Experience, teacher.HireDate, teacher.IsFullTime)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}
	teacher.ID = int(id)
	return nil
}

// GetByID получает преподавателя по ID
func (dao *SQLiteTeacherDAO) GetByID(id int) (*Teacher, error) {
	teacher := &Teacher{}
	query := "SELECT * FROM teachers WHERE id = ?"
	err := dao.db.QueryRow(query, id).Scan(
		&teacher.ID, &teacher.FullName, &teacher.Department,
		&teacher.Experience, &teacher.HireDate, &teacher.IsFullTime)
	if err != nil {
		return nil, err
	}
	return teacher, nil
}

// GetAll получает всех преподавателей
func (dao *SQLiteTeacherDAO) GetAll() ([]*Teacher, error) {
	query := "SELECT * FROM teachers"
	rows, err := dao.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var teachers []*Teacher
	for rows.Next() {
		teacher := &Teacher{}
		err := rows.Scan(
			&teacher.ID, &teacher.FullName, &teacher.Department,
			&teacher.Experience, &teacher.HireDate, &teacher.IsFullTime)
		if err != nil {
			return nil, err
		}
		teachers = append(teachers, teacher)
	}
	return teachers, nil
}

// Update обновляет данные преподавателя
func (dao *SQLiteTeacherDAO) Update(teacher *Teacher) error {
	query := `
	UPDATE teachers 
	SET full_name = ?, department = ?, experience = ?, hire_date = ?, is_full_time = ?
	WHERE id = ?
	`
	_, err := dao.db.Exec(query, teacher.FullName, teacher.Department,
		teacher.Experience, teacher.HireDate, teacher.IsFullTime, teacher.ID)
	return err
}

// Delete удаляет преподавателя
func (dao *SQLiteTeacherDAO) Delete(id int) error {
	query := "DELETE FROM teachers WHERE id = ?"
	_, err := dao.db.Exec(query, id)
	return err
}

// GetTeacherLessons получает все уроки преподавателя
func (dao *SQLiteTeacherDAO) GetTeacherLessons(teacherID int) ([]*Lesson, error) {
	query := `
	SELECT 
		l.date_time,
		l.subject,
		l.teacher_id,
		l.teacher_name,
		l.lesson_number,
		l.student_count
	FROM lessons l
	JOIN teachers t ON l.teacher_id = t.id
	WHERE t.id = ?
	`
	rows, err := dao.db.Query(query, teacherID)
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
