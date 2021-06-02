const utilsHelper = require("../helpers/utils.helper");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authController = {};

authController.loginWithEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return new Error("401 - Email not exists");
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Error(400, "Wrong Password", "login error");
    }

    const accessToken = await user.generateToken(); /// đây là 1 method trong mongose, khi nào cần dùng sẽ gọi nó ra.
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      "Login success"
    );
  } catch (error) {
    console.log("error", error.message);
  }
};
module.exports = authController;
