var express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();
const authMiddleware = require("../middleweares/authentication");

/**
 * @route POST api/user/
 * @description Register new user
 * @access Public
 */
router.post("/", userController.register);

/**
 * **
 * @route GET api/user
 * @description Get all users
 * @access Login Required or Admin authorized
 */
router.get("/", authMiddleware.loginRequired, userController.getUsers);

/**
 * @route GET api/user/me
 * @description Return current user info
 * @access Login required
 */
router.get("/me", authMiddleware.loginRequired, userController.getCurrentUser);

/**
 * @route GET api/user/:id/order
 * @description Return list orders of current user
 * @access Login Required or Admin authorized
 */
router.get(
  "/:id/order",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  userController.getCurrentUserOrder
);

/**
 * @route PUT api/users
 * @description Update user profile
 * @access Login required
 */
router.put("/", authMiddleware.loginRequired, userController.updateUser);

/**
 * @route Put api/user/:id/payment
 * @description User can make payment
 * @access Login required
 */
router.put(
  "/:id/payment",
  authMiddleware.loginRequired,
  userController.paymentUserOder
);

/**
 * @route PUT api/user/:id/topup
 * @description Top-up user balance
 * @access Admin requied
 */
router.put(
  "/:id/topup",
  authMiddleware.loginRequired,
  userController.paymentUserOder
);

module.exports = router;
