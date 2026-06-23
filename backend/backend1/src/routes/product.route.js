const productControllers = require("../controllers/product.controller");
const authorize = require("../middlewares/authorize");
const authenticate = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

const express = require('express')

const Router = express.Router();

Router.get("/", productControllers.getAllProducts);
Router.post("/create", authenticate, authorize("seller"), upload.array("photos"), productControllers.createProduct);
Router.put("/:id", authenticate, authorize("seller"), upload.array("photos"), productControllers.updateProduct);
Router.delete("/:id", authenticate, authorize("seller"), productControllers.deleteProduct);
Router.get("/seller", authenticate, authorize("seller"), productControllers.getProductsBySeller);
Router.get("/:id", authenticate, authorize("seller"), productControllers.getProductById);

module.exports = Router;