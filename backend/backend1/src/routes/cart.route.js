const cartController = require("../controllers/cart.controller");
const authenticate = require("../middlewares/authenticate");

const Router = require("express").Router();


Router.get("/all", authenticate, cartController.getCart);
Router.post("/add", authenticate, cartController.addItem);
Router.post("/update", authenticate, cartController.updateItemQuantity);
Router.delete("/delete/:productId", authenticate, cartController.removeItemFromCart);
Router.put("/clear", authenticate, cartController.clearCart);

module.exports = Router;