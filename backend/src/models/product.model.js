const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
    },
    images: [
        {
            url: String,
            public_id: String
        }
    ],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    }
});

ProductSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;