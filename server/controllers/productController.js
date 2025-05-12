const uuid = require("uuid");
const path = require("path");
const { Product, ProductInfo, View } = require("../models/models");
const ApiError = require("../error/ApiError");

class ProductController {
  // Метод для создания продукта
  async create(req, res, next) {
    try {
      const {
        name,
        groupId,
        typeId,
        length,
        width,
        height,
        load,
        weight,
        frostResistance,
        innerDiameter,
        outerDiameter,
        info, // массив [{ title, description }]
      } = req.body;

      const product = await Product.create({
        name,
        groupId,
        typeId,
        length,
        width,
        height,
        load,
        weight,
        frostResistance,
        innerDiameter,
        outerDiameter,
      });

      // Добавим параметры (ProductInfo), если переданы
      if (info && Array.isArray(info)) {
        const infoItems = info.map((i) => ({
          title: i.title,
          description: i.description,
          productId: product.id,
        }));
        await ProductInfo.bulkCreate(infoItems);
      }

      return res.json(product);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  // Метод для получения всех продуктов
  async getAll(req, res) {
    let { groupId, typeId, viewId, limit, page } = req.query;
    console.log("Received Params:", { groupId, typeId, viewId, limit, page });

    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;

    const where = {};
    if (groupId) where.groupId = groupId;
    if (typeId) where.typeId = typeId;
    if (viewId) where.viewId = viewId;

    try {
      const products = await Product.findAndCountAll({
        where,
        include: [{ model: ProductInfo, as: "info" }],
        limit,
        offset,
      });
      return res.json(products);
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Ошибка при получении продуктов" });
    }
  }

  // Метод для получения одного продукта
  async getOne(req, res) {
    const { id } = req.params;
    try {
      const product = await Product.findOne({
        where: { id },
        include: [{ model: ProductInfo, as: "info" }],
      });

      if (!product) {
        return res.status(404).json({ message: "Продукт не найден" });
      }

      return res.json(product);
    } catch (e) {
      return res.status(500).json({ message: "Ошибка при получении продукта" });
    }
  }

  // Метод для удаления продукта
  async delete(req, res) {
    const { id } = req.params;

    try {
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: "Продукт не найден" });
      }

      // Удаляем связанную инфу
      await ProductInfo.destroy({ where: { productId: id } });

      // (Опционально) логика с View, если она тебе реально нужна
      if (product.viewId) {
        const view = await View.findByPk(product.viewId);
        if (view) {
          // например: await view.destroy();
        }
      }

      await product.destroy();

      return res.json({ message: "Продукт успешно удален" });
    } catch (e) {
      return res.status(500).json({ message: "Ошибка при удалении продукта" });
    }
  }
}

module.exports = new ProductController();
