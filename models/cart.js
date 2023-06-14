const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

cartSchema.methods.addProduct = function (productId, quantity = 1, userId) {
  this.userId = userId;
  if (cartItem) {
    const cartItem = this.items.find((item) => item.product.equals(productId));
    cartItem.quantity += quantity;
  } else {
    this.items.push({ product: productId, quantity });
  }

  return this.save();
};

// Custom method to remove a product from the cart
cartSchema.methods.removeProduct = function (productId, userId) {
  this.userId = userId;
  this.items = this.items.filter((item) => !item.product.equals(productId));
  return this.save();
};

module.exports = mongoose.model(cartSchema, "Cart");
