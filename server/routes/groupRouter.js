const Router = require("express");
const router = new Router();
const groupController = require("../controllers/groupController");
const checkRole = require("../middleware/checkRoleMiddleware");
const upload = require("../middleware/fileMiddleware");

router.post("/", upload.single("image"), groupController.create);
router.put("/:id", groupController.update);
router.patch("/:id/description", groupController.updateDescription);
router.get("/", groupController.getAll);
router.get("/:id", groupController.getOne);
router.delete("/:id", checkRole("ADMIN"), groupController.delete);

module.exports = router;
