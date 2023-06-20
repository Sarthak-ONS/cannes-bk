const router = require("express").Router();

const productController = require("../controllers/product");
const { customRole } = require("../middlewares/custom-role");
const isAuth = require("../middlewares/isAuth");

router.get("/", productController.getProducts);

router.get("/:productId", productController.getSingleProduct);

router.post("/:productId/review", isAuth, productController.postAddReview);

router.delete("/:productId/review", isAuth, productController.deleteReview);

router.post(
  "/add",
  [isAuth, customRole("Admin")],
  productController.addProduct
);

module.exports = router;
