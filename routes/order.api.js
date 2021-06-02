const express = require("express");
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleweares/authentication");
const router = express.Router();

/**
 * @route GET api/order
 * @description User can see list of order
 * @access Login require
 */
router.get("/", authMiddleware.loginRequired, orderController.getAllOrders);
/**
 * @route POST api/order/add
 * @description User can create order
 * @access Login require
 */
router.post("/add", authMiddleware.loginRequired, orderController.createOrder);
/**
 * @route PUT api/order/update
 * @description User can update order
 * @access Login require
 */
router.put(
  "/:id/update",
  authMiddleware.loginRequired,

  orderController.updateOrder
);
/**
 * @route Get api/order/:id
 * @description User can see order detail
 * @access Login required
 */
router.get(
  "/:id",
  authMiddleware.loginRequired,
  orderController.getDetailOrder
);
/**
 * @route Delete api/order/login
 * @description Admin can delete order
 * @access Admin required
 */
router.delete(
  "/:id/delete",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  orderController.deleteOrder
);

module.exports = router;
