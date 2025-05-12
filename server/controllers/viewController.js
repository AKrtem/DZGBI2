const { View } = require("../models/models"); // Импортируем модель
const ApiError = require("../error/ApiError");

class ViewController {
  // Метод для создания нового вида
  async create(req, res) {
    const { name } = req.body;
    try {
      const view = await View.create({ name });
      return res.json(view);
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .json({ message: "Ошибка при создании вида продукции" });
    }
  }

  // Метод для получения всех видов
  async getAll(req, res) {
    try {
      const views = await View.findAll();
      return res.json(views);
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .json({ message: "Ошибка при получении видов продукции" });
    }
  }

  // Метод для получения вида по id
  async getById(req, res) {
    const { id } = req.params;

    try {
      const view = await View.findByPk(id);
      if (!view) {
        return res.status(404).json({ message: "Вид не найден" });
      }

      return res.json(view);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Ошибка при получении вида" });
    }
  }

  // Метод для обновления вида
  async update(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const view = await View.findByPk(id);
      if (!view) {
        return res.status(404).json({ message: "Вид не найден" });
      }

      view.name = name;
      await view.save();

      return res.json(view);
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .json({ message: "Ошибка при обновлении вида продукции" });
    }
  }

  // Метод для удаления вида
  async delete(req, res) {
    const { id } = req.params;

    try {
      // Пытаемся удалить вид
      const deletedView = await View.destroy({ where: { id } });

      // Проверяем, был ли удален вид
      if (!deletedView) {
        return res.status(404).json({ message: "Вид не найден" });
      }

      // Возвращаем успешный ответ, если вид был удален
      return res.json({ message: "Вид успешно удален" });
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .json({ message: "Ошибка при удалении вида продукции" });
    }
  }
}

module.exports = new ViewController();
