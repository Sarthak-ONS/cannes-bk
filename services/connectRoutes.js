const router = require("express").Router();

const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/user");
const productRoutes = require("../routes/products");
const cartRoutes = require("../routes/cart");
const uiRoutes = require("../routes/ui");

// Version 2 Auth Routes
const authRoutesV2 = require("../routes/v2/auth");

// Media Router, TO be used in Subdomain for CDN
const mediaRouter = require("../routes/media");

// Version v1 Routes
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/cdn", mediaRouter);
router.use("/ui", uiRoutes);

// Version v2 Routes
router.use("/v2/auth", authRoutesV2);

module.exports = router;
