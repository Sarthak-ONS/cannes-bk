const cloudinary = require("cloudinary");
const Product = require("../models/product");

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Sports" },
  { id: 4, name: "Health" },
  { id: 5, name: "Appliances" },
  { id: 6, name: "Furniture" },
  { id: 7, name: "Watches" },
  { id: 8, name: "Games" },
  { id: 9, name: "Sarthak" },
];

exports.addProduct = async (req, res, next) => {
  const { name, price, description, category, brand } = req.body;

  let imageArray = [];

  console.log(req.files);

  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );

      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  await Product.create({
    name,
    price,
    description,
    category,
    brand,
    imageUrls: imageArray,
  });
  res.status(200).json({ status: "SUCCESS" });
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).select(
      "-createdAt -updatedAt -ratings -reviews"
    );

    res.status(200).json({ status: "SUCCESS", products, categories });
  } catch (error) {
    console.log(error);
    const err = new Error("Could not fetch Products");
    err.httpStatusCode = 400;
    return next(err);
  }
};
