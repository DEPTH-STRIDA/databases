const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "school_schedule";

const sampleData = {
  teachers: [
    {
      id: 1,
      full_name: "Смирнова Елена Павловна",
      department: "Биология",
      experience: 12,
      hire_date: new Date("2012-08-15"),
      is_full_time: true,
    },
    {
      id: 2,
      full_name: "Козлов Дмитрий Александрович",
      department: "Химия",
      experience: 8,
      hire_date: new Date("2016-02-20"),
      is_full_time: false,
    },
    {
      id: 3,
      full_name: "Морозова Анна Сергеевна",
      department: "Литература",
      experience: 15,
      hire_date: new Date("2009-09-01"),
      is_full_time: true,
    },
    {
      id: 4,
      full_name: "Волков Игорь Николаевич",
      department: "География",
      experience: 6,
      hire_date: new Date("2018-09-01"),
      is_full_time: true,
    },
    {
      id: 5,
      full_name: "Соколова Мария Андреевна",
      department: "Английский язык",
      experience: 10,
      hire_date: new Date("2014-01-15"),
      is_full_time: true,
    },
    {
      id: 6,
      full_name: "Попов Артем Владимирович",
      department: "Физкультура",
      experience: 5,
      hire_date: new Date("2019-08-25"),
      is_full_time: false,
    },
  ],
  lessons: [
    {
      date_time: new Date("2024-01-15T09:00:00"),
      subject: "Биология",
      teacher_id: 1,
      teacher_name: "Смирнова Елена Павловна",
      lesson_number: "Б1",
      student_count: 28,
    },
    {
      date_time: new Date("2024-01-15T10:30:00"),
      subject: "Химия",
      teacher_id: 2,
      teacher_name: "Козлов Дмитрий Александрович",
      lesson_number: "Х1",
      student_count: 24,
    },
    {
      date_time: new Date("2024-01-15T12:00:00"),
      subject: "Литература",
      teacher_id: 3,
      teacher_name: "Морозова Анна Сергеевна",
      lesson_number: "Л1",
      student_count: 30,
    },
    {
      date_time: new Date("2024-01-16T09:00:00"),
      subject: "География",
      teacher_id: 4,
      teacher_name: "Волков Игорь Николаевич",
      lesson_number: "Г1",
      student_count: 26,
    },
    {
      date_time: new Date("2024-01-16T10:30:00"),
      subject: "Английский язык",
      teacher_id: 5,
      teacher_name: "Соколова Мария Андреевна",
      lesson_number: "А1",
      student_count: 15,
    },
    {
      date_time: new Date("2024-01-16T12:00:00"),
      subject: "Физкультура",
      teacher_id: 6,
      teacher_name: "Попов Артем Владимирович",
      lesson_number: "Ф1",
      student_count: 32,
    },
    {
      date_time: new Date("2024-01-17T09:00:00"),
      subject: "Биология",
      teacher_id: 1,
      teacher_name: "Смирнова Елена Павловна",
      lesson_number: "Б2",
      student_count: 27,
    },
    {
      date_time: new Date("2024-01-17T10:30:00"),
      subject: "Литература",
      teacher_id: 3,
      teacher_name: "Морозова Анна Сергеевна",
      lesson_number: "Л2",
      student_count: 29,
    },
  ],
};

async function seed() {
  let client;

  try {
    client = await MongoClient.connect(url);
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    // Очистка существующих данных
    await db.collection("teachers").deleteMany({});
    await db.collection("lessons").deleteMany({});
    console.log("Cleared existing data");

    // Добавление тестовых данных
    await db.collection("teachers").insertMany(sampleData.teachers);
    await db.collection("lessons").insertMany(sampleData.lessons);
    console.log("Added sample data");

    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    if (client) {
      await client.close();
      console.log("Disconnected from MongoDB");
    }
  }
}

seed();
