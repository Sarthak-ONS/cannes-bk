const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  console.log("THIS IS METHOD BEFORE SAVING A VALUE");

  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  return next();
});

userSchema.methods.getForgotPasswordToken = function () {
  const forgotToken = crypto.randomBytes(30).toString("hex");
  this.resetToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  this.resetTokenExpiration = Date.now() + 20 * 60 * 1000;

  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);
