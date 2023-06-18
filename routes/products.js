const router = require("express").Router();

const productController = require("../controllers/product");
const { customRole } = require("../middlewares/custom-role");
const isAuth = require("../middlewares/isAuth");

router.get("/", productController.getProducts);

router.post(
  "/add",
  [isAuth, customRole("Admin")],
  productController.addProduct
);

module.exports = router;
