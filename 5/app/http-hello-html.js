var http = require("http");

http
  .createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

    // Начало HTML
    response.write(`<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Данные из БД</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        table { 
            border-collapse: collapse; 
            width: 100%;
            margin-bottom: 30px;
        }
        th, td { 
            border: 1px solid #dee2e6; 
            padding: 12px; 
            text-align: left; 
        }
        th { 
            background-color: #f8f9fa;
            font-weight: bold;
        }
        h1, h2 {
            color: #333;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Данные о преподавателях и уроках</h1>

        <h2>Преподаватели</h2>
        <table>
            <tr>
                <th>ID</th>
                <th>ФИО</th>
                <th>Предмет</th>
                <th>Опыт работы</th>
                <th>Количество уроков</th>
            </tr>
            <tr>
                <td>1</td>
                <td>Преподаватель_1</td>
                <td>Математика</td>
                <td>10 лет</td>
                <td>2</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Преподаватель_2</td>
                <td>Информатика</td>
                <td>8 лет</td>
                <td>4</td>
            </tr>
            <tr>
                <td>3</td>
                <td>Преподаватель_3</td>
                <td>Математика</td>
                <td>15 лет</td>
                <td>4</td>
            </tr>
            <tr>
                <td>4</td>
                <td>Преподаватель_4</td>
                <td>История</td>
                <td>5 лет</td>
                <td>2</td>
            </tr>
            <tr>
                <td>5</td>
                <td>Преподаватель_5</td>
                <td>Математика</td>
                <td>12 лет</td>
                <td>5</td>
            </tr>
            <tr>
                <td>6</td>
                <td>Преподаватель_6</td>
                <td>Математика</td>
                <td>7 лет</td>
                <td>6</td>
            </tr>
            <tr>
                <td>7</td>
                <td>Преподаватель_7</td>
                <td>Математика</td>
                <td>9 лет</td>
                <td>4</td>
            </tr>
            <tr>
                <td>8</td>
                <td>Преподаватель_8</td>
                <td>Литература</td>
                <td>6 лет</td>
                <td>3</td>
            </tr>
            <tr>
                <td>9</td>
                <td>Преподаватель_9</td>
                <td>История</td>
                <td>4 года</td>
                <td>0</td>
            </tr>
            <tr>
                <td>10</td>
                <td>Преподаватель_10</td>
                <td>История</td>
                <td>11 лет</td>
                <td>3</td>
            </tr>
        </table>

        <h2>Уроки</h2>
        <table>
            <tr>
                <th>Дата и время</th>
                <th>Предмет</th>
                <th>Преподаватель</th>
            </tr>
            <tr>
                <td>2024-12-30 22:50</td>
                <td>Литература</td>
                <td>Преподаватель_8</td>
            </tr>
            <tr>
                <td>2025-01-10 22:50</td>
                <td>История</td>
                <td>Преподаватель_4</td>
            </tr>
            <tr>
                <td>2025-01-16 22:50</td>
                <td>Математика</td>
                <td>Преподаватель_7</td>
            </tr>
            <tr>
                <td>2025-01-22 22:50</td>
                <td>Математика</td>
                <td>Преподаватель_1</td>
            </tr>
            <tr>
                <td>2025-01-21 22:50</td>
                <td>Математика</td>
                <td>Преподаватель_6</td>
            </tr>
            <tr>
                <td>2025-01-10 22:50</td>
                <td>История</td>
                <td>Преподаватель_10</td>
            </tr>
            <tr>
                <td>2025-01-19 22:50</td>
                <td>История</td>
                <td>Преподаватель_2</td>
            </tr>
            <tr>
                <td>2025-01-04 22:50</td>
                <td>Математика</td>
                <td>Преподаватель_7</td>
            </tr>
            <tr>
                <td>2024-12-28 22:50</td>
                <td>История</td>
                <td>Преподаватель_4</td>
            </tr>
            <tr>
                <td>2025-01-01 22:50</td>
                <td>Физика</td>
                <td>Преподаватель_5</td>
            </tr>
        </table>
    </div>
</body>
</html>`);

    response.end();
  })
  .listen(3000);

console.log("Server running at http://localhost:3000/");
