import express from "express";
import fetch from "node-fetch";
import cors from "cors";
const app = express();
const port = 3000;

const CAYLEY_API = "http://localhost:64210/api/v1";

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Запрос всех учителей
app.get("/api/teachers", async (req, res) => {
  try {
    const query = `
      var result = g.V().has("type", "teacher").toArray();
      g.emit(result);
    `;
    const response = await fetch(`${CAYLEY_API}/query/gizmo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cayley error: ${text}`);
    }
    const data = await response.json();
    res.json(data.result || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Запрос всех уроков
app.get("/api/lessons", async (req, res) => {
  try {
    const query = `
      var result = g.V().has("type", "lesson").toArray();
      g.emit(result);
    `;
    const response = await fetch(`${CAYLEY_API}/query/gizmo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cayley error: ${text}`);
    }
    const data = await response.json();
    res.json(data.result || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Запрос уроков по учителю
app.get("/api/lessons/teacher/:teacherId", async (req, res) => {
  try {
    const query = `
      var result = g.V().has("type", "lesson").has("teacher_id", "${req.params.teacherId}").toArray();
      g.emit(result);
    `;
    const response = await fetch(`${CAYLEY_API}/query/gizmo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cayley error: ${text}`);
    }
    const data = await response.json();
    res.json(data.result || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Запрос уроков по предмету
app.get("/api/lessons/subject/:subject", async (req, res) => {
  try {
    const query = `
      var result = g.V().has("type", "lesson").has("subject", "${req.params.subject}").toArray();
      g.emit(result);
    `;
    const response = await fetch(`${CAYLEY_API}/query/gizmo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cayley error: ${text}`);
    }
    const data = await response.json();
    res.json(data.result || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Добавление нового учителя
app.post("/api/teachers", async (req, res) => {
  try {
    const teacher = req.body;
    const query = `
      g.V("teacher${teacher.id}")
        .out("type").is("teacher")
        .out("full_name").is("${teacher.full_name}")
        .out("department").is("${teacher.department}")
        .out("experience").is("${teacher.experience}")
        .out("hire_date").is("${teacher.hire_date}")
        .out("is_full_time").is("${teacher.is_full_time}");
    `;

    const response = await fetch(`${CAYLEY_API}/query/gizmo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cayley error: ${text}`);
    }

    res.json({ message: "Teacher added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Добавление нового урока
app.post("/api/lessons", async (req, res) => {
  try {
    const lesson = req.body;
    const query = `
      g.V("lesson${lesson.id}")
        .out("type").is("lesson")
        .out("date_time").is("${lesson.date_time}")
        .out("subject").is("${lesson.subject}")
        .out("teacher_id").is("${lesson.teacher_id}")
        .out("teacher_name").is("${lesson.teacher_name}")
        .out("lesson_number").is("${lesson.lesson_number}")
        .out("student_count").is("${lesson.student_count}")
        .out("taught_by").is("teacher${lesson.teacher_id}");
    `;

    const response = await fetch(`${CAYLEY_API}/query/gizmo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cayley error: ${text}`);
    }

    res.json({ message: "Lesson added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
