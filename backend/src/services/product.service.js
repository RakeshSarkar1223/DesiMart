const Product = require("../models/product.model");

const createProduct = async (productData) => {
    const product = new Product(productData);
    await product.save();
    return product;
}

