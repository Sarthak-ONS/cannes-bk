const cloudinary = require("cloudinary");
const Product = require("../models/product");

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
    const products = Product.find();

    res.status(200).json({ status: "SUCCESS", products });
  } catch (error) {
    console.log(error);
    const err = new Error("Could not fetch Products");
    err.httpStatusCode = 400;
    return next(err);
  }
};
