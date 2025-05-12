const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Cart } = require("../models/models");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h", // Время жизни токена 24 часа
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;

    console.log(">>> Registration endpoint hit");

    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный email или password"));
    }

    try {
      // Приводим email к нижнему регистру
      const normalizedEmail = email.toLowerCase();

      // Проверка на существующего пользователя
      const candidate = await User.findOne({
        where: { email: normalizedEmail },
      });
      if (candidate) {
        return next(
          ApiError.badRequest("Пользователь с таким email уже существует")
        );
      }

      const hashPassword = await bcrypt.hash(password, 10);
      console.log("Хеш перед сохранением:", hashPassword);
      // Если роль не указана, она автоматически становится USER
      const safeRole = role && role === "ADMIN" ? "ADMIN" : "USER";

      // Создание нового пользователя
      const user = await User.create({
        email: normalizedEmail,
        role: safeRole,
        password: hashPassword,
      });

      // Создание корзины для нового пользователя
      const cart = await Cart.create({ userId: user.id });

      // Генерация JWT токена
      const token = generateJwt(user.id, user.email, user.role);

      return res.json({ token });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ошибка при создании пользователя"));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Приводим email к нижнему регистру
      const normalizedEmail = email.toLowerCase();

      // Поиск пользователя в БД
      const user = await User.findOne({ where: { email: normalizedEmail } });
      if (!user) {
        return next(
          ApiError.badRequest("Пользователь с таким email не найден")
        );
      }

      // Проверка пароля
      console.log("Из базы:", user.password); // Хеш пароля в базе данных
      console.log("С формы:", password); // Введённый пароль
      const comparePassword = bcrypt.compareSync(password, user.password); // Сравниваем хеш с обычным паролем
      if (!comparePassword) {
        return next(ApiError.badRequest("Указан неверный пароль"));
      }

      // Генерация токена после успешного входа
      const token = generateJwt(user.id, user.email, user.role);
      return res.json({ token });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ошибка при входе"));
    }
  }

  async check(req, res, next) {
    try {
      console.log("check: старт");
      const token = req.headers.authorization?.split(" ")[1];
      console.log("token:", token);

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("decoded:", decoded);

      const user = await User.findOne({ where: { id: decoded.id } });
      console.log("user:", user);

      const newToken = generateJwt(user.id, user.email, user.role);
      return res.json({ token: newToken });
    } catch (e) {
      console.error("Ошибка в check:", e);
      return next(ApiError.internal("Непредвиденная ошибка!"));
    }
  }
}

module.exports = new UserController();
