const router = require("express").Router();

const userController = require("../controllers/user");
const isAuth = require("../middlewares/isAuth");

router.get("/", isAuth, userController.fetchUserProfile);

router.post("/address", isAuth, userController.addAddress);

router.put("/address", isAuth, userController.updateAddress);

module.exports = router;
