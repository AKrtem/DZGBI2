const Router = require("express");
const router = new Router();
const productRouter = require("./productRouter");
const userRouter = require("./userRouter");
const groupRouter = require("./groupRouter");
const typeRouter = require("./typeRouter");
const viewRouter = require("./viewRouter");
const mailRouter = require("./mailRouter.js");

router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/group", groupRouter);
router.use("/product", productRouter);
router.use("/view", viewRouter);
router.use("/mail", mailRouter);

module.exports = router;
