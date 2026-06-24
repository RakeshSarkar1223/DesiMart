const Product = require("../models/product.model");
const { uploadToCloudinary } = require("../utils/cloudinary");
const cloudinary = require("../config/cloudinary");
const { validateProduct } = require("../utils/validator/product.validator");

const createProduct = async (productData) => {
  if (productData.images && productData.images.length > 0) {
    try {
      const uploadedImages = [];
      for (const image of productData.images) {
        const result = await uploadToCloudinary(image, "products");
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
      productData.images = uploadedImages;
    } catch (error) {
      throw new Error("Error uploading images to Cloudinary");
    }
  }
  const product = new Product(productData);
  await product.save();
  return product;
};

const updateProduct = async (productId, updateData, sellerId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Check if the user is the owner of the product
  if (product.seller.toString() !== sellerId) {
    throw new Error("Unauthorized to update this product");
  }

  // Merge existing + new values
  const data = {
    ...product.toObject(),
    ...updateData,
  };

  // Validate merged object
  const { error } = validateProduct(data);

  if (error) {
    throw new Error(error.details[0].message);
  }

  // Upload images if provided
  if (updateData.images?.length) {
    // Delete old images
    for (const img of product.images) {
      if (img.public_id) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch (err) {
          console.error(
            `Failed to delete old image ${img.public_id} from Cloudinary:`,
            err,
          );
        }
      }
    }

    // Upload new images
    const uploadedImages = [];
    for (const image of updateData.images) {
      try {
        const result = await uploadToCloudinary(image, "products");
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      } catch (err) {
        console.error("Failed to upload new image to Cloudinary:", err);
        throw new Error("Error uploading images to Cloudinary");
      }
    }
    data.images = uploadedImages;
  }

  Object.assign(product, data);

  return await product.save();
};

const deleteProduct = async (productId, sellerId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }
  // Check if the user is the owner of the product
  if (product.seller.toString() !== sellerId) {
    throw new Error("Unauthorized to delete this product");
  }
  // Delete images from Cloudinary
  for (const img of product.images) {
    if (img.public_id) {
      try {
        await cloudinary.uploader.destroy(img.public_id);
      } catch (err) {
        console.error(
          `Failed to delete image ${img.public_id} from Cloudinary:`,
          err,
        );
      }
    }
  }
  await product.remove();
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId).populate(
    "seller",
    "name email",
  );
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

const getAllProducts = async () => {
  const products = await Product.find();
  return products;
};

const getProductsBySeller = async (sellerId) => {
  const products = await Product.find({ seller: sellerId });
  return products;
};

const decreaseProductQuantity = async (productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");
  if (product.stock < quantity) {
    throw new Error("Insufficient Stock");
    return false;
  }
  product.stock -= quantity;
  await product.save();
  return true;
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  getProductsBySeller,
  decreaseProductQuantity
};
