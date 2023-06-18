const Cart = require("../models/cart");
const logger = require("../utils/logger");

const { validationResult } = require("express-validator");

exports.addtoCart = async (req, res, next) => {
  try {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   const err = new Error(errors.array()[0].msg);
    //   err.httpStatusCode = 422;
    //   return next(err);
    // }

    const userId = req.userId;
    const { productId } = req.body;

    console.log(
      productId,
      "This is the product Id bete the saww from user ",
      userId
    );

    // const cart = await Cart.findOne({ userId });

    // if (!cart) {
    //   const cart = await Cart.create({
    //     userId,
    //     items: [
    //       {
    //         product: productId,
    //         quantity: 1,
    //       },
    //     ],
    //   });
    //   await cart.save();
    //   res.status(200).json({
    //     status: "SUCCESS",
    //     message: "Cart Created, Product is Added",
    //     cart,
    //   });
    // }

    // let itemIndex = cart.items.findIndex(
    //   (p) => p.product.toString() === productId
    // );

    // if (itemIndex > -1) {
    //   console.log("ITEM IS ALREADY IN CART");
    //   let productItem = cart.items[itemIndex];
    //   productItem.quantity = productItem.quantity + 1;
    //   cart.items[itemIndex] = productItem;
    // } else {
    //   cart.items.push({ product: productId, quantity: 1 });
    // }
    // await cart.save();

    // logger.info(`PRODUCT ADDED TO CARD`, { userId });

    return res.status(200).json({ status: "SUCCESS", cart: {} });
  } catch (error) {
    console.log(error);
    const err = new Error("Unable to add to Cart");
    err.httpStatusCode = 401;
    return next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "Cart doesn't exists!" });
    }

    let itemIndex = cart.items.findIndex(
      (p) => p.product.toString() === productId
    );

    if (itemIndex < 0) {
      return res
        .status(401)
        .json({ status: "ERROR", message: "Item doesn't exists in Cart" });
    }

    let productItem = cart.items[itemIndex];

    if (productItem.quantity > 1) {
      productItem.quantity = productItem.quantity - 1;
      cart.items[itemIndex] = productItem;
    } else {
      cart.items.splice(itemIndex, 1);
    }
    await cart.save();

    res.status(200).json({ status: "SUCCESS", cart });
  } catch (error) {
    console.log(error);
    const err = new Error("Unable to remove from Cart");
    err.httpStatusCode = 401;
    return next(err);
  }
};

exports.updateCartItem = async (req, res, next) => {};

exports.clearCart = async (req, res, next) => {
  const userId = req.userId;

  try {
    await Cart.findOneAndDelete({ userId });
    res.status(200).json({ status: "SUCCESS", message: "Cleared Cart" });
  } catch (error) {
    const err = new Error("Could not clear Cart");
    err.httpStatusCode = 401;
    return next(err);
  }
};

exports.checkout = async (req, res, next) => {};
