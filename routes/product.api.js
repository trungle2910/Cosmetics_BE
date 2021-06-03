const express = require("express");
const productController = require("../controllers/product.controller");
const router = express.Router();
const authMiddleware = require("../middleweares/authentication");
/**
 * @route Get api/products?page=1&limit=10
 * @description User can get list off all products
 * @access Public
 */
router.get("/", productController.getAllProducts);
/**
 * @route Get api/product/:id
 * @description User can get product by id // detail product
 * @access Public
 */
router.get("/:id", productController.getSigleProduct);
/**
 * @route POST api/product/add
 * @description Admin can create product
 * @access Admin required
 */
router.post(
  "/add",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  productController.addProduct
);
/**
 * @route PUT api/product/:id/update
 * @description Admin can update product
 * @access Admin required
 */
router.put(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  productController.updateProduct
);
/**
 * @route DELETE api/product/:id/delete
 * @description Admin can delete product
 * @access Admin required
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  productController.deleteProduct
);
module.exports = router;
