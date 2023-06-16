const express = require("express");
const isAuth = require("../middlewares/isAuth");
const cartController = require("../controllers/cart");

const router = express.Router();

// POST Add to Cart
router.post("/add", isAuth, cartController.addtoCart);

// DELETE Remove from Cart
router.delete("/remove/:itemId", isAuth, cartController.removeFromCart);

router.delete("/all", isAuth, cartController.clearCart);

router.post("/all", isAuth, cartController.checkout);

module.exports = router;
