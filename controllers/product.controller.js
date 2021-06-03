const utilsHelper = require("../helpers/utils.helper");
const Product = require("../models/Product");
//Producttentication controllers
const productController = {};
//get all prodcuts with filter and query
productController.getAllProducts = async (req, res, next) => {
  try {
    let { page, limit, sortBy, ...filter } = { ...req.query }; //// hoi lai Tan //

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalProducts = await Product.count({ ...filter, isDeleted: false });

    const totalPages = Math.ceil(totalProducts / limit);
    const offset = limit * (page - 1);
    const products = await Product.find(filter)
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("");

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { products, totalPages },
      null,
      "All products"
    );
  } catch (error) {
    next(error);
  }
};
productController.getSigleProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product)
      return next(
        new AppError(404, "Product not found", "Get Single product Error")
      );
    product = product.toJSON();

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Detail product"
    );
  } catch (error) {
    next(error);
  }
};
//admin add new product
productController.addProduct = async (req, res, next) => {
  try {
    let { name, description, price, category, salePrice, imageUrl } = req.body;
    let product = await Product.findOne({ name: name });
    if (product) return next(new Error("400 - Product already exists"));
    let newProduct = await Product.create({
      name,
      description,
      price,
      category,
      salePrice,
      imageUrl,
    });

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { newProduct },
      null,
      "Product created"
    );
  } catch (error) {
    next(error);
  }
};

//admin update product
productController.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, description, price, category, salePrice, imageUrl } =
      req.body;

    const product = await Product.findOneAndUpdate(
      { _id: productId },
      { name, description, price, category, salePrice, imageUrl },
      { new: true }
    );
    if (!product) {
      return next(new Error("Product not found or User not authorized"));
    }

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Product updated"
    );
  } catch (error) {
    next(error);
  }
};
//admin delete product

productController.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await Product.findOneAndDelete({ _id: productId });
    if (!product) {
      return next(new Error("Product not found or User not authorized"));
    }

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Product Deleted "
    );
  } catch (error) {
    next(error);
  }
};
module.exports = productController;
