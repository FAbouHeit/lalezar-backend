import mongoose from "mongoose";
import Product from "../models/ProductModel.js";
import fs from "fs";

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single Product
export const getProduct = async (req, res) => {
  const id = req.body.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such book" });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ error: "No such a product" });
  }

  res.status(200).json(product);
};

// Get Products by category
export const getProductByCategory = async (req, res) => {
  const categoryId = req.body.id;

  try {

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const products = await Product.find({category : categoryId})

    res.status(200).json(products)

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};



// Create a product
export const createProduct = async (req, res) => {
  const { name, description, price, stock, note, display, color, category } =
    req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Please upload an image" });
  }
  const image = req.file.filename;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      note,
      display,
      color,
      category,
      image,
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    const imagePath = `public/images/${req.file.filename}`;
    fs.unlinkSync(imagePath);
    console.log(error);
    res.status(500).json("Internal server error");
  }
};

// update a product

export const updateProduct = async (req, res) => {
  const id = req.body.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      error: "Product not found",
    });
  }

  const oldProduct = await Product.findById(id);

  try {
    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      note: req.body.note,
      display: req.body.display,
      category: req.body.category,
      color: req.body.color,
    };

    const oldImagePath = `public/images/${oldProduct.image}`;

    if (req.file) {
      updatedData.image = req.file.filename;

      fs.unlink(oldImagePath, (err) => {
        if (err) {
          return res.status(500).json({
            error: `error deleting the old image`,
          });
        }
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      updatedData,
      {
        new: true,
      }
    );

    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({
      error: `Error, ${error.message}`,
    });
  }
};

// Delete a Product
export const deleteProduct = async (req, res) => {
  const id = req.body.id;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findOne({ _id: id });

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const imagePath = `public/images/${product.image}`;
    fs.unlinkSync(imagePath);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};
