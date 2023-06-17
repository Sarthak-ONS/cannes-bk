const router = require("express").Router();

const productController = require("../controllers/product");
const isAuth = require("../middlewares/isAuth");

router.get("/", productController.getProducts);

router.post("/add", isAuth, productController.addProduct);

module.exports = router;
