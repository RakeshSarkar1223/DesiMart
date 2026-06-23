const Cart = require("../models/cart.model");
const Product = require("../models/product.model")

const getCartByUserId = async (userId) => {
    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        // console.log(cart);
        return cart;
    } catch (error) {
        console.error("Error in getCartByUserId service:", error);
        throw error;
    }
};

const addItemToCart = async (userId, productId, quantity) => {
    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }
        const product = await Product.findById(productId); 
        if(product.stock < quantity){
            throw new Error("Insufficient stock")
        }
        const newProduct = {
            product: productId,
            quantity 
        };
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (existingItemIndex !== -1) {
            cart.items[existingItemIndex].quantity += quantity || 1;
        } else {
            cart.items.push(newProduct);
        }
        await cart.save();
        return await getCartByUserId(userId);
    }catch (error) {
        console.error("Error in addItemToCart service:", error);
        throw error;
    }
}

const updateItemQuantity = async (userId, productId, quantity) => {
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new Error("Cart not found");
        }
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            throw new Error("Item not found in cart");
        }
        const product = await Product.findById(productId);
        if(product.stock < quantity){
            throw new Error("Insufficient stock")
        }
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        return await getCartByUserId(userId);
    }catch (error) {
        console.error("Error in updateItemQuantity service:", error);
        throw error;
    }
}

const removeItemFromCart = async (userId, productId) => {
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new Error("Cart not found");
        }
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        return await getCartByUserId(userId);
    }catch (error) {
        console.error("Error in removeItemFromCart service:", error);
        throw error;
    }
}

const clearCart = async (userId) => {
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new Error("Cart not found");
        }
        cart.items = [];
        await cart.save();
        return await getCartByUserId(userId);
    }catch (error) {
        console.error("Error in clearCart service:", error);
        throw error;
    }
}

module.exports = {
    getCartByUserId,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart
};