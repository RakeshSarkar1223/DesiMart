const cartServices = require('../services/cart.services');

const getCart = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const cart = await cartServices.getCartByUserId(userId);
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error in getCart controller:", error);
        res.status(500).json({ message: error.message });
    }
};

const addItem = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        console.log(req.body);
        const { productId, quantity } = req.body;
        const cart = await cartServices.addItemToCart(userId, productId, quantity);
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error in addItem controller:", error);
        res.status(500).json({ message: error.message });
    }
};

const updateItemQuantity = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { productId, quantity } = req.body;
        const cart = await cartServices.updateItemQuantity(userId, productId, quantity);
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error in updateItemQuantity controller:", error);
        res.status(500).json({ message: error.message });
    }
};

const removeItemFromCart = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { productId } = req.params;
        const cart = await cartServices.removeItemFromCart(userId, productId);
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error in removeItemFromCart controller:", error);
        res.status(500).json({ message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const cart = await cartServices.clearCart(userId);
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error in clearCart controller:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addItem,
    updateItemQuantity,
    removeItemFromCart,
    clearCart
};
