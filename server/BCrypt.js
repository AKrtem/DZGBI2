const bcrypt = require("bcrypt");

const password = "777"; // Введенный пароль
const hashedPassword =
  "$2b$10$wipDia/zSZ5f9eTlIgPi2elfpqnDAsLEZ2xk5eX7e/UpFmou1jQMC"; // Хеш, скопированный из базы данных

// Пробуем сравнить хеш с паролем
const match = bcrypt.compareSync(password, hashedPassword);
console.log("Пароль совпал:", match); // Это должно вывести true, если пароли совпадают
