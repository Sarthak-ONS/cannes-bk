const Cart = require("../models/cart");
const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");

const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const { validationResult } = require("express-validator");

exports.getUserCart = async (req, res, next) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.product",
        select: "imageUrls name _id price",
      })
      .exec();

    if (!cart) {
      return res
        .status(200)
        .json({ status: "SUCCESS", message: "Cart is Empty" });
    }

    const totalPrice = cart.calculateTotalPrice(cart.couponCode);
    await cart.save();

    return res.status(200).json({ status: "SUCCESS", cart });
  } catch (error) {
    console.log(error);
    const err = new Error("Could not fetch Cart");
    err.httpStatusCode = 500;
    return next(err);
  }
};

exports.addtoCart = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error(errors.array()[0].msg);
      err.httpStatusCode = 422;
      return next(err);
    }

    const userId = req.userId;
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(200)
        .json({ status: "ERROR", message: "Invalid Product Id" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(400).json({ status: "ERRROR", message: "Product not found" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const cart = await Cart.create({
        userId,
        items: [
          {
            product: productId,
            quantity: 1,
          },
        ],
      });
      await cart.save();
      res.status(200).json({
        status: "SUCCESS",
        message: "Cart Created, Product is Added",
        cart,
      });
    }

    let itemIndex = cart.items.findIndex(
      (p) => p.product.toString() === productId
    );

    if (itemIndex > -1) {
      console.log("ITEM IS ALREADY IN CART");
      let productItem = cart.items[itemIndex];
      productItem.quantity = productItem.quantity + 1;
      cart.items[itemIndex] = productItem;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }
    await cart.save();

    logger.info(`PRODUCT ADDED TO CARD`, { userId });

    return res.status(200).json({ status: "SUCCESS", cart });
  } catch (error) {
    console.log(error);
    const err = new Error("Unable to add to Cart");
    err.httpStatusCode = 500;
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
    err.httpStatusCode = 500;
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

exports.applyDiscountOnCart = async (req, res, next) => {
  try {
    const { couponCode } = req.body;

    console.log(couponCode, " COUPON CODE IN BODY");

    const cart = await Cart.findOne({ userId: req.userId })
      .populate({
        path: "items.product",
        select: "imageUrls name _id price",
      })
      .exec();

    if (!cart) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "Cart not found" });
    }
    cart.calculateTotalPrice(couponCode);
    await cart.save();
    res.status(200).json({
      status: "SUCCESS",
      message: "Applied Discount",
      cart,
    });
  } catch (error) {
    console.log(error);
    const err = new Error("Could not apply discount");
    err.httpStatusCode = 500;
    next(err);
  }
};

exports.checkout = async (req, res, next) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId })
      .populate("items.product", "price name")
      .exec();

    if (!cart) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "No cart found" });
    }

    const user = await User.findById(userId);

    if (!user.isVerified) {
      res.status(401).json({ status: "ERROR", message: "User not verified" });
    }

    if (!user.address) {
      res
        .status(400)
        .json({ status: "ERROR", message: "Please add a address" });
    }

    const token = user.getJwtToken();

    await stripe.checkout.sessions
      .create({
        customer_email: user.email,
        payment_method_types: ["card"],
        mode: "payment",
        success_url: process.env.FRONTEND_SERVER_URL + "/orders",
        cancel_url: process.env.FRONTEND_SERVER_URL + "/cart",
        line_items: cart.items.map((p) => {
          return {
            price_data: {
              currency: "INR",
              product_data: {
                name: p.product.name,
              },
              unit_amount: p.product.price * 100,
            },
            quantity: p.quantity,
          };
        }),
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 150 * 100,
                currency: "INR",
              },
              display_name: "Next day air",
            },
          },
        ],
        discounts: [
          {
            coupon: "gOj47W1N",
          },
        ],
        metadata: {
          token: token,
        },
      })
      .then(async (session) => {
        return res.status(200).redirect(session.url);
      });
    res.status(401).json({ status: "ERROR", message: "Payment Failed" });
  } catch (error) {
    console.log(error);
    const err = new Error("Could not place order!");
    err.httpStatusCode = 500;
    next(err);
  }
};

exports.checkoutSuccess = async (req, res, next) => {
  try {
    const event = req.body;

    let token;
    if (event.type !== "checkout.session.completed") {
      return res.status(400);
    }
    token = event.data.object.metadata.token;
    let decodedData = await jwt.decode(token, process.env.JWT_KEY);
    console.log(decodedData);

    const userId = decodedData.userId;

    const cart = await Cart.findOne({ userId })
      .populate("items.product", "price name")
      .exec();

    if (!cart) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "No cart found" });
    }

    const user = await User.findById(userId);

    if (!user.isVerified) {
      res.status(401).json({ status: "ERROR", message: "User not verified" });
    }

    if (!user.address) {
      res
        .status(400)
        .json({ status: "ERROR", message: "Please add a address" });
    }

    console.log(cart);

    const order = await Order.create({
      user: userId,
      products: cart.items,
      shippingAddress: user.address,
      totalAmount: cart.totalPrice,
    });

    await Cart.findOneAndDelete({ userId });

    await user.save();
    await order.save();

    return res.status(200);
  } catch (error) {
    console.log(error);
    const err = new Error("Could not checkout success");
    err.httpStatusCode = 500;
    next(err);
  }
};
