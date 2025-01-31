# Лабораторная работа №3: DAO и SQL-инъекции

## Цель работы
1. Изучение паттерна DAO (Data Access Object)
2. Работа с несколькими связанными таблицами
3. Исследование безопасности SQL-запросов

## Задание

### Часть 1: Реализация DAO
1. Перевести код из лабораторной работы №2 в DAO
2. Реализовать базовые операции:
   - Создание объектов через DAO.Insert()
   - Получение данных через DAO.GetXxx()
   - Работа со списками объектов

### Часть 2: Связанные таблицы
1. Добавить таблицу Teachers, связанную с Lessons
2. Обновить API DAO для работы с новой структурой
3. Реализовать запросы со связями между таблицами

### Часть 3: Безопасность
1. Продемонстрировать SQL-инъекции на небезопасном коде
2. Провести аудит DAO на уязвимости
3. Использовать PreparedStatement для защиты

## Структура проекта

```
app/
├── dao/
│   ├── lesson_dao.go    # Безопасная реализация DAO для уроков
│   └── teacher_dao.go   # DAO для преподавателей
├── dao_unsafe/
│   └── lesson_dao.go    # Небезопасная реализация для демонстрации
├── migrations/
│   └── 001_add_teachers.sql  # SQL миграции
├── go.mod
├── go.sum
└── main.go             # Демонстрационный код
```

## Требования

### Подготовка окружения
- Go 1.22 или выше
- SQLite
- Зависимости:
  ```bash
  go mod init app
  go get modernc.org/sqlite
  ```

### Функциональные требования
1. Реализация интерфейсов DAO
2. Корректная работа со связанными таблицами
3. Демонстрация и защита от SQL-инъекций

## Этапы выполнения

### 1. Подготовка структуры
1. Создать пакет dao
2. Определить интерфейсы
3. Реализовать базовые операции

### 2. Работа с данными
1. Создать таблицы через миграции
2. Реализовать связи между таблицами
3. Добавить методы для работы со связанными данными

### 3. Безопасность
1. Создать небезопасную версию DAO
2. Продемонстрировать уязвимости
3. Реализовать защищенную версию

## Примечания
- Использовать параметризованные запросы
- Обрабатывать все ошибки
- Закрывать ресурсы
- Документировать код
