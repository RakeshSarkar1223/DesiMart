const joi = require('joi');

const productSchema = joi.object({
    name: joi.string().min(3).max(100).required(),
    description: joi.string().min(10).max(1000).required(),
    brand: joi.string().min(2).max(50).required(),
    originalPrice: joi.number().positive().required(),
    discountedPrice: joi.number().positive().required(),
    category: joi.string().min(3).max(50).required(),
    stock: joi.number().integer().min(0).required(),
    seller: joi.string().hex().length(24).required() // Assuming MongoDB ObjectId
}).unknown(true); // Allow unknown keys

const validateProduct = (productData) => {
    return productSchema.validate(productData);
}

module.exports = validateProduct;