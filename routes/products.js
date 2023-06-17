const router = require("express").Router();

const productController = require("../controllers/product");
const isAuth = require("../middlewares/isAuth");

router.post("/add", isAuth, productController.addProduct);

router.get("/", productController.getProducts);

module.exports = router;
