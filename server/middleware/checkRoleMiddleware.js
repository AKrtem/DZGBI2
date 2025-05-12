const jwt = require("jsonwebtoken");

module.exports = function (roles) {
  // Если roles - это строка, превращаем её в массив
  if (typeof roles === "string") {
    roles = [roles];
  }

  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      return next();
    }

    try {
      const token = req.headers.authorization?.split(" ")[1]; // "Bearer token"

      if (!token) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      // Расшифровка токена
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Проверка роли, если роль не соответствует, возвращаем ошибку доступа
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Нет доступа" });
      }

      // Добавляем decoded user данные в request
      req.user = decoded;

      // Дальше обработка запроса
      next();
    } catch (e) {
      console.error(e);
      return res.status(401).json({ message: "Не авторизован" });
    }
  };
};
