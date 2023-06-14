const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Clothing",
        "Books",
        "Home",
        "Beauty",
        "Sports",
        "Toys",
        "Health",
        "Jewelry",
        "Automotive",
        "Appliances",
        "Furniture",
        "Grocery",
        "Movies",
        "Music",
        "Pet Supplies",
        "Tools",
        "Baby",
        "Office",
        "Garden",
        "Shoes",
        "Watches",
        "Outdoor",
        "Video Games",
        "Crafts",
        "Industrial",
      ],
    },
    brand: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    imageUrls: [
      {
        id: {
          type: String,
          required: true,
        },
        secure_url: {
          type: String,
          required: true,
        },
      },
    ],
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
      },
    ],
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
