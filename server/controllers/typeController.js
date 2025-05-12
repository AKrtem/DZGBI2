const { Type } = require("../models/models");
const ApiError = require("../error/ApiError");

class TypeController {
  // Метод для создания типа
  async create(req, res) {
    const { name, viewId, groupId } = req.body;
    const type = await Type.create({ name, viewId, groupId });
    return res.json(type);
  }

  // Метод для получения типов с фильтрацией по groupId и viewId
  async getAll(req, res) {
    const { groupId, viewId } = req.query; // Получаем параметры из query

    try {
      // Фильтрация типов по groupId и viewId, если они переданы
      const where = {};
      if (groupId) where.groupId = groupId;
      if (viewId) where.viewId = viewId;

      const types = await Type.findAll({
        where: where, // Применяем фильтрацию
      });

      return res.json(types);
    } catch (error) {
      console.error("Ошибка при получении типов:", error);
      return res
        .status(500)
        .json({ message: "Ошибка сервера при получении типов" });
    }
  }

  // Метод для обновления типа
  async update(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const type = await Type.findByPk(id);
      if (!type) {
        return res.status(404).json({ message: "Тип не найден" });
      }

      type.name = name;
      await type.save();

      return res.json(type);
    } catch (e) {
      return res.status(500).json({ message: "Ошибка сервера при обновлении" });
    }
  }

  // Метод для удаления типа
  async delete(req, res) {
    const { id } = req.params; // Извлекаем id из параметров запроса

    try {
      const type = await Type.findByPk(id); // Ищем тип по id

      if (!type) {
        return res.status(404).json({ message: "Тип не найден" }); // Если не найден, возвращаем ошибку
      }

      await type.destroy(); // Удаляем тип

      return res.status(200).json({ message: "Тип успешно удалён" }); // Отправляем успешный ответ
    } catch (e) {
      console.error("Ошибка при удалении типа:", e);
      return res
        .status(500)
        .json({ message: "Ошибка сервера при удалении типа" }); // Ошибка сервера
    }
  }
}

module.exports = new TypeController();
