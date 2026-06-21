const productServices = require('../services/product.service')
const validateProduct = require('../utils/validator/product.validator');

const createProduct = async (req, res) => {
    try {
        const { _id} = req.user;
        req.body.seller = _id; // Associate product with the authenticated user
        const { error } = validateProduct(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const product = await productServices.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { _id} = req.user;
        // req.body.seller = _id; // Associate product with the authenticated user
        const product = await productServices.updateProduct(req.params.id, req.body, _id);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { _id} = req.user;
        await productServices.deleteProduct(req.params.id, _id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await productServices.getProductById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await productServices.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getProductsBySeller = async (req, res) => {
    try {
        const { _id} = req.user;
        const products = await productServices.getProductsBySeller(_id);
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { createProduct, updateProduct, deleteProduct, getProductById, getAllProducts, getProductsBySeller }