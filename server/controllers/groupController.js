const { Group } = require("../models/models");
const ApiError = require("../error/ApiError");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

class GroupController {
  // Метод для создания группы
  async create(req, res) {
    try {
      const name = req.body.name?.trim();
      const viewId = parseInt(req.body.viewId, 10);
      const imageFile = req.file;
      const description = req.body.description?.trim() || null;
      const isFavorite = req.body.isFavorite === "true";

      if (!name || isNaN(viewId)) {
        return res
          .status(400)
          .json({ message: "Некорректные данные: имя и viewId обязательны" });
      }

      const existing = await Group.findOne({ where: { name } });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Группа с таким названием уже существует" });
      }

      let fileName = imageFile ? imageFile.filename : null;

      if (fileName) {
        const inputPath = path.resolve(__dirname, "..", "static", fileName);
        const outputPath = path.resolve(
          __dirname,
          "..",
          "static",
          "watermarked_" + fileName
        );
        const watermarkPath = path.resolve(
          __dirname,
          "..",
          "static",
          "watermark.png"
        );

        try {
          const image = sharp(inputPath);
          const metadata = await image.metadata();

          // Масштабируем водяной знак: ширина 30% от ширины изображения
          const watermarkWidth = Math.round(metadata.width * 0.3);
          const watermarkBuffer = await sharp(watermarkPath)
            .resize({ width: watermarkWidth })
            .toBuffer();

          await image
            .composite([
              {
                input: watermarkBuffer,
                gravity: "northeast",
                blend: "overlay",
              },
            ])
            .toFile(outputPath);

          fs.unlinkSync(inputPath);
          fileName = "watermarked_" + fileName;
        } catch (err) {
          console.error("Ошибка при добавлении водяного знака:", err);
          return res
            .status(500)
            .json({ message: "Ошибка обработки изображения" });
        }
      }

      const group = await Group.create({
        name,
        viewId,
        image: fileName,
        description,
        isFavorite,
      });

      return res.json(group);
    } catch (error) {
      console.error("Ошибка при создании группы:", error);
      return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, viewId, description, isFavorite } = req.body;

    try {
      const group = await Group.findByPk(id);
      if (!group) {
        return res.status(404).json({ message: "Группа не найдена" });
      }

      if (name !== undefined) group.name = name;
      if (viewId !== undefined) group.viewId = viewId;
      if (description !== undefined) group.description = description;
      if (isFavorite !== undefined) group.isFavorite = isFavorite;

      await group.save();
      return res.json(group);
    } catch (error) {
      console.error("Ошибка при обновлении группы:", error);
      return res.status(500).json({ message: "Ошибка при обновлении группы" });
    }
  }

  // Метод для обновления описания группы
  async updateDescription(req, res) {
    const { id } = req.params; // ID группы
    const { description } = req.body; // новое описание

    try {
      // Находим группу по ID
      const group = await Group.findByPk(id);

      // Если группа не найдена, возвращаем ошибку
      if (!group) {
        return res.status(404).json({ message: "Группа не найдена" });
      }

      group.description = description;

      await group.save();

      return res.json(group);
    } catch (error) {
      console.error("Ошибка при обновлении описания группы:", error);
      return res
        .status(500)
        .json({ message: "Ошибка сервера при обновлении описания" });
    }
  }

  async getOne(req, res) {
    const { id } = req.params;
    try {
      const group = await Group.findByPk(id);
      if (!group) {
        return res.status(404).json({ message: "Группа не найдена" });
      }
      return res.json(group);
    } catch (error) {
      console.error("Ошибка при получении группы по ID:", error);
      return res
        .status(500)
        .json({ message: "Ошибка сервера при получении группы" });
    }
  }

  async getAll(req, res) {
    try {
      const groups = await Group.findAll();
      return res.json(groups);
    } catch (error) {
      console.error("Ошибка при получении групп:", error);
      return res
        .status(500)
        .json({ message: "Ошибка сервера при получении групп" });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      const group = await Group.findOne({ where: { id } });

      if (!group) {
        return res.status(404).json({ message: "Группа не найдена" });
      }

      await Group.destroy({ where: { id } });

      return res.status(200).json({ message: "Группа успешно удалена" });
    } catch (error) {
      console.error("Ошибка при удалении группы:", error);
      return res
        .status(500)
        .json({ message: "Ошибка сервера при удалении группы" });
    }
  }
}

module.exports = new GroupController();
