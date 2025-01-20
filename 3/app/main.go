package main

import (
	"app/dao"
	"app/dao_unsafe"
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"time"

	_ "modernc.org/sqlite"
)

func clearTables(db *sql.DB) error {
	queries := []string{
		"DELETE FROM lessons",
		"DELETE FROM teachers",
		"DELETE FROM sqlite_sequence", // Сброс автоинкремента
	}

	for _, query := range queries {
		_, err := db.Exec(query)
		if err != nil {
			return fmt.Errorf("ошибка очистки таблиц: %v", err)
		}
	}
	return nil
}

func seedData(teacherDAO dao.TeacherDAO, lessonDAO dao.LessonDAO) error {
	// Добавляем преподавателей
	teachers := []*dao.Teacher{
		{
			FullName:   "Иванов Иван Иванович",
			Department: "Информатика",
			Experience: 15,
			HireDate:   time.Now().AddDate(-15, 0, 0),
			IsFullTime: true,
		},
		{
			FullName:   "Петрова Мария Сергеевна",
			Department: "Математика",
			Experience: 8,
			HireDate:   time.Now().AddDate(-8, 0, 0),
			IsFullTime: true,
		},
		{
			FullName:   "Сидоров Петр Петрович",
			Department: "История",
			Experience: 5,
			HireDate:   time.Now().AddDate(-5, 0, 0),
			IsFullTime: false,
		},
	}

	log.Println("Добавление преподавателей:")
	for _, t := range teachers {
		if err := teacherDAO.Insert(t); err != nil {
			return fmt.Errorf("ошибка добавления преподавателя: %v", err)
		}
		log.Printf("Добавлен преподаватель: %+v\n", t)
	}

	// Добавляем уроки
	subjects := []string{"Информатика", "Математика", "История"}
	for i, subject := range subjects {
		teacher := teachers[i]
		lesson := &dao.Lesson{
			DateTime:     time.Now().Add(time.Duration(i*24) * time.Hour),
			Subject:      subject,
			TeacherID:    sql.NullInt64{Int64: int64(teacher.ID), Valid: true},
			TeacherName:  teacher.FullName,
			LessonNumber: fmt.Sprintf("Л%d", i+1),
			StudentCount: 20 + rand.Intn(10),
		}
		if err := lessonDAO.Insert(lesson); err != nil {
			return fmt.Errorf("ошибка добавления урока: %v", err)
		}
		log.Printf("Добавлен урок: %+v\n", lesson)
	}
	return nil
}

func main() {
	log.Println("=== Демонстрация работы DAO с несколькими таблицами ===")

	// Подключение к БД
	log.Println("1. Подключение к базе данных SQLite")
	db, err := sql.Open("sqlite", "./lessons.db")
	if err != nil {
		log.Fatal("Ошибка подключения к БД:", err)
	}
	defer db.Close()

	// Очистка таблиц
	log.Println("2. Очистка существующих данных")
	if err := clearTables(db); err != nil {
		log.Fatal(err)
	}
	// Создание DAO объектов
	log.Println("3. Инициализация DAO объектов")
	teacherDAO := dao.NewTeacherDAO(db)
	lessonDAO := dao.NewLessonDAO(db)

	// Заполнение тестовыми данными
	log.Println("4. Заполнение тестовыми данными")
	if err := seedData(teacherDAO, lessonDAO); err != nil {
		log.Fatal(err)
	}

	// ЧАСТЬ 1: Базовые операции с уроками (старая функциональность)
	log.Println("\n=== ЧАСТЬ 1: Базовые операции с уроками ===")

	// Создание простого урока
	simpleLesson := &dao.Lesson{
		DateTime:     time.Now(),
		Subject:      "История",
		TeacherID:    sql.NullInt64{Valid: false},
		TeacherName:  "Сидоров П.П.",
		LessonNumber: fmt.Sprintf("И%d", 1+rand.Intn(8)),
		StudentCount: 25,
	}

	if err := lessonDAO.Insert(simpleLesson); err != nil {
		log.Fatal("Ошибка добавления простого урока:", err)
	}
	log.Printf("Добавлен простой урок: %+v\n", simpleLesson)

	// Получение урока по предмету
	foundLesson, err := lessonDAO.GetBySubject("История")
	if err != nil {
		log.Fatal("Ошибка поиска урока:", err)
	}
	log.Printf("Найден урок по предмету: %+v\n", foundLesson)

	// ЧАСТЬ 2: Работа с преподавателями и связанными уроками
	log.Println("\n=== ЧАСТЬ 2: Работа с преподавателями ===")

	// Создание преподавателя
	teacher := &dao.Teacher{
		FullName:   "Петров Иван Сергеевич",
		Department: "Математика",
		Experience: 10,
		HireDate:   time.Now().AddDate(-10, 0, 0),
		IsFullTime: true,
	}

	if err := teacherDAO.Insert(teacher); err != nil {
		log.Fatal("Ошибка добавления преподавателя:", err)
	}
	log.Printf("Добавлен преподаватель: %+v\n", teacher)

	// Создание урока с привязкой к преподавателю
	lesson := &dao.Lesson{
		DateTime:     time.Now(),
		Subject:      "Математика",
		TeacherID:    sql.NullInt64{Int64: int64(teacher.ID), Valid: true},
		TeacherName:  teacher.FullName,
		LessonNumber: fmt.Sprintf("М%d", 1+rand.Intn(8)),
		StudentCount: 20,
	}

	if err := lessonDAO.Insert(lesson); err != nil {
		log.Fatal("Ошибка добавления урока:", err)
	}
	log.Printf("Добавлен урок с привязкой: %+v\n", lesson)

	// Получение всех уроков
	log.Println("\nПолучение всех уроков:")
	allLessons, err := lessonDAO.GetAll()
	if err != nil {
		log.Fatal("Ошибка получения всех уроков:", err)
	}
	for i, l := range allLessons {
		log.Printf("%d. %+v\n", i+1, l)
	}

	// Получение уроков преподавателя
	log.Printf("\nПолучение уроков преподавателя %s:\n", teacher.FullName)
	teacherLessons, err := teacherDAO.GetTeacherLessons(teacher.ID)
	if err != nil {
		log.Fatal("Ошибка получения уроков преподавателя:", err)
	}
	for i, l := range teacherLessons {
		log.Printf("%d. %+v\n", i+1, l)
	}

	log.Println("\n=== ЧАСТЬ 3: Демонстрация SQL-инъекции ===")

	// Создание небезопасного DAO
	unsafeDAO := dao_unsafe.NewUnsafeLessonDAO(db)

	// Пример безопасного запроса
	log.Println("\n1. Нормальный запрос:")
	unsafeLesson, err := unsafeDAO.UnsafeGetBySubject("Математика")
	if err != nil {
		log.Printf("Ошибка запроса: %v\n", err)
	} else {
		log.Printf("Результат: %+v\n", unsafeLesson)
	}

	// Пример SQL-инъекции
	log.Println("\n2. Попытка SQL-инъекции:")
	maliciousInput := "' OR '1'='1"
	unsafeLesson, err = unsafeDAO.UnsafeGetBySubject(maliciousInput)
	if err != nil {
		log.Printf("Ошибка запроса: %v\n", err)
	} else {
		log.Printf("Результат инъекции: %+v\n", unsafeLesson)
	}

	// Пример опасного удаления
	log.Println("\n3. Попытка удаления через SQL-инъекцию:")
	maliciousDelete := "История' OR '1'='1"
	log.Printf("Демонстрация опасного SQL запроса: DELETE FROM lessons WHERE subject='%s'\n", maliciousDelete)
	log.Println("(Запрос не выполнен в целях сохранения данных)")

	// Показываем оставшиеся уроки
	log.Println("\nСписок уроков после всех операций:")
	allLessons, err = lessonDAO.GetAll()
	if err != nil {
		log.Fatal("Ошибка получения всех уроков:", err)
	}
	for i, l := range allLessons {
		log.Printf("%d. %+v\n", i+1, l)
	}

	log.Println("\n=== Демонстрация завершена ===")
}
