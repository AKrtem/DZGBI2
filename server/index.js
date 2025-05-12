require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const models = require("./models/models");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const path = require("path");
const { saveProducts, parseExcel } = require("./services/excelImporter"); // Подключаем сервис для загрузки продуктов
const PORT = process.env.PORT || 5001;

const app = express();

// Настройка CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Разрешаем доступ с порта 3000 (фронтенд)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Разрешенные методы
  })
);

app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/api", router); // Подключаем маршруты
app.use(fileUpload({ useTempFiles: true, tempFileDir: "./tmp/" }));

// Логика для работы с продуктами (загрузка из Excel при старте сервера)
const loadProducts = async () => {
  try {
    const excelData = parseExcel("/Users/tema/Documents/НОМЕНКЛАТУРА.xlsx"); // Путь к вашему Excel файлу
    await saveProducts(excelData); // Сохранение продуктов в базу данных
    console.log("All products have been loaded successfully.");
  } catch (error) {
    console.error("Error loading products:", error);
  }
};

// Загружаем продукты из Excel при старте сервера
loadProducts();

// Пример маршрута для авторизации пользователя
app.get("/api/user/auth", (req, res) => {
  console.log("Запрос пришел на сервер"); // Проверяем, что запрос от клиента доходит до сервера
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("Токен не передан");
    return res.status(400).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Токен декодирован:", decoded);
    const user = getUserById(decoded.id);
    console.log("Пользователь из базы:", user);

    const newToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Новый токен:", newToken);

    res.json({ user, token: newToken });
  } catch (err) {
    console.log("Ошибка при проверке токена:", err);
    res.status(401).json({ message: "Invalid token" });
  }
});

// Обработка ошибок, последний Middleware
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.get("/", (req, res) => {
      res.send("Hello, world!");
    });
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
