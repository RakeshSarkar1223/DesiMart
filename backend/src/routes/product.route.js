const productControllers = require("../controllers/product.controller");
const authorize = require("../middlewares/authorize");
const authenticate = require("../middlewares/authenticate");

const express = require('express')

const Router = express.Router();

Router.get("/", productControllers.getAllProducts);
Router.post("/product/create", authenticate, authorize("seller"),productControllers.createProduct);
Router.put("/products/:id", authenticate, authorize("seller"),productControllers.updateProduct);
Router.delete("/products/:id", authenticate, authorize("seller"),productControllers.deleteProduct);
Router.get("/products/:id", authenticate,authorize("seller"), productControllers.getProductById);
Router.get("/seller/products", authenticate, authorize("seller"), productControllers.getProductsBySeller);

module.exports = Router;