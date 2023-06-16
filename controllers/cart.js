const Cart = require("../models/cart");

exports.addtoCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      await Cart.create({
        userId,
        items: [
          {
            product: productId,
            quantity: 1,
          },
        ],
      });

      res.status(200).json({
        status: "SUCCESS",
        message: "Cart Created, Product is Added",
        cart,
      });
    }

    let itemIndex = cart.items.findIndex(
      (p) => p.product.toString() === productId
    );

    cart.items.forEach((p) => {
      console.log(p.product.toString());
    });

    if (itemIndex > -1) {
      console.log("ITEM IS ALREADY IN CART");
      let productItem = cart.items[itemIndex];
      productItem.quantity = productItem.quantity + 1;
      cart.items[itemIndex] = productItem;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }
    await cart.save();

    res.status(200).json({ status: "SUCCESS", cart });
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
