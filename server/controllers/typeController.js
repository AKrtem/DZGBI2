const { Type } = require("../models/models");
const ApiError = require("../error/ApiError");

class TypeController {
  async create(req, res) {
    const { name } = req.body;
    const type = await Type.create({ name });
    return res.json(type);
  }

  async getAll(req, res) {
    const types = await Type.findAll();
    return res.json(types);
  }
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
}

module.exports = new TypeController();
