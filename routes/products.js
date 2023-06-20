const router = require("express").Router();
const { body } = require("express-validator");
const productController = require("../controllers/product");
const { customRole } = require("../middlewares/custom-role");
const isAuth = require("../middlewares/isAuth");

router.get("/", productController.getProducts);

router.get("/:productId", productController.getSingleProduct);

// Review Routes Starts

router.post(
  "/:productId/review",
  isAuth,
  body("text", "Invalid Review Text").trim().isLength({ min: 25, max: 150 }),
  productController.postAddReview
);

router.delete("/:productId/review", isAuth, productController.deleteReview);

router.patch(
  "/:productId/review",
  isAuth,
  body("text", "Invalid Review Text").trim().isLength({ min: 25, max: 150 }),
  productController.updateReview
);

// Review Routes ends

// Rating Routes Starts
// router.post();

// Rating Routes Ends

router.post(
  "/add",
  [isAuth, customRole("Admin")],
  productController.addProduct
);

module.exports = router;
