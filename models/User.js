const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: false },
    phone: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["user", "admin"],
    },
    avatarUrl: {
      type: String,
      default:
        "https://user-images.githubusercontent.com/16608864/35882949-bbe13aa0-0bab-11e8-859c-ceda3b213818.jpeg",
    },
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.emailVerified;
  delete obj.emailVerificationCode;
  delete obj.isDeleted;
  return obj;
};

userSchema.statics.findOrCreate = function findOrCreate(profile, cb) {
  const userObj = new this();
  this.findOne({ email: profile.email }, async function (err, result) {
    if (!result) {
      /// create user.
      //1. make new password
      const newPassword = "" + Math.floor(Math.random() * 100000000);
      const salt = await brcypt.genSalt(10);
      newPassword = await brcypt.hash(newPassword, salt);
      //2.save user//
      userObj.name = profile.name;
      userObj.email = profile.email;
      userObj.password = newPassword;
      userObj.avatarUrl = profile.avatarUrl;
      //3. call the cb (call back)
      await userObj.save(cb);
    } else {
      /// send the user info to passport
      cb(err, result); /// send the result to callback function in passport helper
    }
  });
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return accessToken;
};
userSchema.plugin(require("./plugins/isDeletedFalse"));
mongoose.models = {};
const User = mongoose.model("User", userSchema);
module.exports = User;
