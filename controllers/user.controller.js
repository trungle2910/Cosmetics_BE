const utilsHelper = require("../helpers/utils.helper");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Order = require("../models/Order");
const { AppError } = require("../helpers/utils.helper");

const userController = {};

userController.register = async (req, res, next) => {
  try {
    let { name, email, password, role } = req.body;
    let user = await User.findOne({ email: email });
    if (user) return next(new Error("401 - Email already exists"));

    const salt = await bcrypt.genSalt(10);
    const encodedPassword = await bcrypt.hash(password, salt);
    user = await User.create({ name, email, password: encodedPassword, role });
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      "Account created !!"
    );
  } catch (error) {
    console.log("error", error.message);
  }
};
userController.getUsers = async (req, res, next) => {
  try {
    let { page, limit, sortBy, ...filter } = { ...req.query };

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const totalUsers = await User.countDocuments({
      ...filter,
      isDeleted: false,
    });
    const totalPages = Math.ceil(totalUsers / limit);
    const offset = limit * (page - 1);

    let users = await User.find(filter)
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit);
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { users, totalPages },
      null,
      "Get users Success"
    );
  } catch (error) {
    next(error);
  }
};

userController.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user)
      return next(
        new AppError(400, "User not found", "Get Current User Error")
      );
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      "Get current user successful"
    );
  } catch (error) {
    next(error);
  }
};
userController.updateUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const { name, address, phone, avatarUrl } = req.body;
    const userUpdate = await User.findByIdAndUpdate(
      userId,
      { name: name, address: address, phone: phone, avatarUrl: avatarUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: userUpdate,
      message: "Update Profile successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
userController.getCurrentUserOrder = async (req, res, next) => {
  try {
    //pagination
    let { page, limit, sortBy, ...filter } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const totalUsers = await User.countDocuments({
      ...filter,
      isDeleted: false,
    });
    const totalPages = Math.ceil(totalUsers / limit);
    const offset = limit * (page - 1);
    //current user
    const currentUserId = req.userId;
    const currentUser = await User.findById(currentUserId);
    //target user
    const userId = req.params.id;
    //current usser request other order
    if (userId !== currentUserId && currentUser.role !== "admin") {
      return next(new Error("Only admin can check orther user Order detail"));
    }
    //current user request its order or admin request user's order
    const order = await Order.find({ userId })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit);

    //in case no order
    if (!order) return next(new Error(`401 - ${userId} has no order`));
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order, totalPages },
      null,
      `Get order from userId: ${userId} success`
    );
  } catch (error) {
    next(new Error());
  }
};
userController.paymentUserOder = async (req, res, next) => {
  try {
    //get request detail.
    const orderId = req.params.id;
    const currentUserId = req.userId;
    /// find order to pay, get balance

    let order = await Order.findById(orderId);
    let currentUser = await User.findById(currentUserId);
    const total = order.total;
    const funds = currentUser.balance;
    //check funds
    if (total > funds) return next(new Error("403 - Insufficient balance"));

    // update new balance
    user = await User.findOneAndUpdate(
      { _id: currentUserId },
      { balance: funds - total },
      { new: true }
    );
    //update order
    order = await Order.findOneAndUpdate(
      { _id: orderId },
      { status: "paid" },
      { new: true }
    );
  } catch (error) {
    next(new Error());
  }
};
module.exports = userController;
