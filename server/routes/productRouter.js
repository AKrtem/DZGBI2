const Router = require("express");
const router = new Router();
const productController = require("../controllers/productController");
const checkRole = require("../middleware/checkRoleMiddleware"); // Подключаем middleware для проверки роли

// Маршрут для создания продукта (доступен всем)
router.post("/", productController.create);

// Маршрут для получения всех продуктов (доступен всем)
router.get("/", productController.getAll);

// Маршрут для получения одного продукта (доступен всем)
router.get("/:id", productController.getOne);

// Маршрут для удаления продукта (доступен только админам)
router.delete("/:id", checkRole("ADMIN"), productController.delete);

module.exports = router;
