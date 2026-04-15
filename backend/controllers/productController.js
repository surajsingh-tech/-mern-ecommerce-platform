import { json } from "express";
import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "user not found",
      });
    }

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }
    if (isNaN(productPrice)) {
      return res
        .status(400)
        .json({ success: false, message: "Product price must be a number" });
    }

    // Handle multiple image uploads
    let productImage = [];
    if (req.files && req.files.length > 0) {
      // create promise for all  uploads
      const uploadPromises = req.files.map((file) => {
        const fileUri = getDataUri(file);
        return cloudinary.uploader.upload(fileUri, { folder: "e_products" });
      });

      //  wait until for all promise are completed
      const results = await Promise.allSettled(uploadPromises);

      //check how many images are successfully uploaded
      const successfulUploads = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

      //check how many images are not successfully uploaded
      const failedUploads = results.filter((r) => r.status === "rejected");

      //if some image are not upload in cloudinary
      if (failedUploads.length > 0) {
        // rollback: delete already uploaded images
        await Promise.all(
          successfulUploads.map((img) =>
            cloudinary.uploader.destroy(img.public_id),
          ),
        );

        return res.status(400).json({
          success: false,
          message: "Some images failed to upload",
        });
      }

      // if all is ok then push results in productImage one by one
      productImage = successfulUploads.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
      }));
    }

    //create a product in db
    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImage, //array of objects [{url , public_id},{url , public_id}]
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProduct = async (_, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(404).json({
        success: false,
        products: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "Product id not found",
      });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    //Delete images from cloudinary
    if (product.productImage && product.productImage.length > 0) {
      for (let img of product.productImage) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    //Delete Product from mongodb
    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product id not found",
      });
    }
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages,
    } = req.body;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All field are Mandatory",
      });
    }
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let updatedImages = [];

    //keep selected old images
    if (existingImages) {
      const keepIds = JSON.parse(existingImages);
      updatedImages = product.productImage.filter((img) =>
        keepIds.includes(img.public_id),
      );

      //Delete only removed images
      const removedImages = product.productImage.filter(
        (img) => !keepIds.includes(img.public_id),
      );

      for (let img of removedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      updatedImages = product.productImage; // keeep all if nothing sent
    }

    //Upload new images if any
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "e_products",
        });
        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    //Update Product
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.productImage = updatedImages;

    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product successfully updated",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
