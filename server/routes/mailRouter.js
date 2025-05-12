const express = require("express");
const fileUpload = require("express-fileupload");
const { sendMail } = require("../controllers/mailController");

const router = express.Router();

// Обязательно до .post — иначе не увидит файлы
router.use(fileUpload({ useTempFiles: true }));

router.post("/", sendMail);

module.exports = router;
