package main

import (
	"fmt"
	"log"
	"math/rand"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	_ "modernc.org/sqlite" // Используем modernc.org/sqlite как драйвер
)

// Teacher модель преподавателя
type Teacher struct {
	ID         uint `gorm:"primaryKey"`
	FullName   string
	Department string
	Experience int
	HireDate   time.Time
	IsFullTime bool
	Lessons    []Lesson // Связь один-ко-многим
}

// Lesson модель урока
type Lesson struct {
	ID           uint `gorm:"primaryKey"`
	DateTime     time.Time
	Subject      string
	TeacherID    uint    // Внешний ключ
	Teacher      Teacher `gorm:"foreignKey:TeacherID"` // Связь с Teacher
	LessonNumber string
	StudentCount int
}

func main() {
	// Подключение к БД
	db, err := gorm.Open(sqlite.Dialector{
		DriverName: "sqlite",
		DSN:        "school.db",
	}, &gorm.Config{})
	if err != nil {
		log.Fatal("Ошибка подключения к БД:", err)
	}

	// Автоматическая миграция схемы
	db.AutoMigrate(&Teacher{}, &Lesson{})

	// Создание тестовых данных
	createTestData(db)

	// Демонстрация запросов
	fmt.Println("\n=== Демонстрация запросов ===")

	// 1. Получение всех уроков с информацией о преподавателях
	fmt.Println("\n1. Все уроки с преподавателями:")
	var lessons []Lesson
	db.Preload("Teacher").Find(&lessons)
	for _, l := range lessons {
		fmt.Printf("Урок: %s, Преподаватель: %s, Дата: %v\n",
			l.Subject, l.Teacher.FullName, l.DateTime.Format("2006-01-02 15:04"))
	}

	// 2. Группировка уроков по предметам с подсчетом
	fmt.Println("\n2. Количество уроков по предметам:")
	type Result struct {
		Subject string
		Count   int64
	}
	var results []Result
	db.Model(&Lesson{}).Select("subject, count(*) as count").Group("subject").Find(&results)
	for _, r := range results {
		fmt.Printf("%s: %d уроков\n", r.Subject, r.Count)
	}

	// 3. Поиск преподавателей с наибольшим количеством уроков
	fmt.Println("\n3. Топ преподавателей по количеству уроков:")
	var teacherStats []struct {
		FullName    string
		Department  string
		LessonCount int64
	}
	db.Model(&Teacher{}).
		Select("teachers.full_name, teachers.department, COUNT(lessons.id) as lesson_count").
		Joins("LEFT JOIN lessons ON lessons.teacher_id = teachers.id").
		Group("teachers.id").
		Order("lesson_count DESC").
		Find(&teacherStats)

	for _, ts := range teacherStats {
		fmt.Printf("%s (%s): %d уроков\n", ts.FullName, ts.Department, ts.LessonCount)
	}
}

func createTestData(db *gorm.DB) {
	// Создание преподавателей
	departments := []string{"Математика", "Физика", "История", "Информатика", "Литература"}
	var teachers []Teacher

	for i := 0; i < 10; i++ {
		teacher := Teacher{
			FullName:   fmt.Sprintf("Преподаватель_%d", i+1),
			Department: departments[rand.Intn(len(departments))],
			Experience: 1 + rand.Intn(20),
			HireDate:   time.Now().AddDate(-rand.Intn(10), -rand.Intn(12), -rand.Intn(28)),
			IsFullTime: rand.Float32() > 0.3,
		}
		db.Create(&teacher)
		teachers = append(teachers, teacher)
	}

	// Создание уроков
	for i := 0; i < 25; i++ {
		teacher := teachers[rand.Intn(len(teachers))]
		lesson := Lesson{
			DateTime:     time.Now().Add(time.Duration(rand.Intn(30)) * 24 * time.Hour),
			Subject:      teacher.Department,
			TeacherID:    teacher.ID,
			LessonNumber: fmt.Sprintf("%d", 1+rand.Intn(8)),
			StudentCount: 15 + rand.Intn(15),
		}
		db.Create(&lesson)
	}
}
