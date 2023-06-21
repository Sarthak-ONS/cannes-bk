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
      },
    },
  ],
  discount: {
    type: Number,
    default: 0,
  },
  couponCode: {
    type: String,
    default: null,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});

cartSchema.methods.calculateTotalPrice = function (couponCode) {
  console.log("CALCULATING TOTAL PRICE");
  console.log("APPLYING THE COUPON CODE : ", couponCode);

  let totalItemsPrice = this.items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  let deliveryCharge = 150;
  let discountedPrice =
    totalItemsPrice - (totalItemsPrice * this.discount) / 100 + deliveryCharge;

  if (couponCode === "FLAT50") {
    discountedPrice = discountedPrice - discountedPrice / 2;
  }

  this.couponCode = couponCode;
  this.totalPrice = discountedPrice;
  return discountedPrice;
};

module.exports = mongoose.model("Cart", cartSchema);
