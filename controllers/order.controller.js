const { AppError } = require("../helpers/utils.helper");
const utilsHelper = require("../helpers/utils.helper");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const orderController = {};

orderController.createOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    console.log(userId);
    //create Order that represent.
    const user = await User.findById(userId);
    if (!user) {
      return next(new Error("400-User not found"));
    }
    const product = await Product.findById(productId);

    let order = await Order.create({
      userId,
      products: product,
    });
    /* await order.populate("userId").execPopulate(); */

    utilsHelper.sendResponse(res, 200, true, { order }, null, "Order created");
  } catch (error) {
    next(error);
  }
};
//get list of order //
orderController.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user");

    utilsHelper.sendResponse(res, 200, true, { orders }, null, "All order");
  } catch (error) {
    next(error);
  }
};
//Get detail of an order by its ID
orderController.getDetailOrder = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);
    if (!order)
      return next(
        new AppError(404, "Order not found", "Get Single order Error")
      );
    order = order.toJSON();
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order },
      null,
      "Get detail order success"
    );
  } catch (error) {
    next(error);
  }
};
//Update Order
orderController.updateOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    const orderId = req.params.id;
    const { productId } = req.body;

    let order = await Order.findOneAndUpdate(
      {
        userId: userId,
        _id: orderId,
      },

      { products: productId },
      { new: true }
    );

    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
    utilsHelper.sendResponse(res, 200, true, { order }, null, "order send");
  } catch (error) {
    next(error);
  }
};
//

//delete order
orderController.deleteOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    const orderId = req.params.id;
    const order = await Order.findOneAndDelete(
      { userId: userId, _id: orderId },
      { isDeleted: true }
    );
    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
    utilsHelper.sendResponse(res, 200, true, null, null, "Order Deleted ");
  } catch (error) {
    next(error);
  }
};
module.exports = orderController;
