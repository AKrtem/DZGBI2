const Router = require("express");
const router = new Router();
const viewController = require("../controllers/viewController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", viewController.create); // Создать новый вид
router.get("/", viewController.getAll); // Получить все виды
router.get("/:id", viewController.getById); // Получить вид по id
router.put("/:id", viewController.update); // Обновить вид
router.delete("/:id", checkRole("ADMIN"), viewController.delete);

module.exports = router;
