const Cart = require("../models/cart");
const Product = require("../models/product");

exports.addtoCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      Cart.create({
        userId,
        items: [
          {
            productId,
            quantity: 1,
          },
        ],
      });
    }
  } catch (error) {
    console.log(error);
    const err = new Error("Unable to add to Cart");
    err.httpStatusCode = 401;
    return next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {};

exports.updateCartItem = async (req, res, next) => {};

exports.clearCart = async (req, res, next) => {};

exports.checkout = async (req, res, next) => {};
