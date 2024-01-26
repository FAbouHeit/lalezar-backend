import mongoose from "mongoose";
import Product from "../models/ProductModel.js";
import fs from "fs";

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("color", "hex name");
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Product by name

export const getProductByName = async (req, res) => {
  const name = req.params.name;

  try {
    const product = await Product.findOne({ name })
      .populate("category", "name")
      .populate("color", "hex name");

    if (!product) {
      return res.status(404).json({ error: "No such a product" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All Products With Paginate
export const getAllProductsWithPaginate = async (req, res) => {
  try {
    const offset = req.offset || 0;
    const limit = req.limit || 10;

    const products = await Product.find()
      .populate("category", "name")
      .populate("color", "hex name")
      .limit(limit)
      .skip(offset)
      .exec();
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProductsDash = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("color", "hex name");
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Products based on the serach and filter categories

// export const getProductsSearchAndFilter = async (req, res) => {
//   try {
//     const { query, categories } = req.query;
//     console.log(req.query);

//     const searchQuery = query ? { $text: { $search: query } } : {};
//     const categoryFilter = categories
//       ? {
//           category: {
//             $in: categories
//               .split(",")
//               .map((categoryId) => Types.ObjectId(categoryId)),
//           },
//         }
//       : {};

//     const products = await Product.find({
//       ...searchQuery,
//       ...categoryFilter,
//     }).populate("category", "name");

//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// Get a single Product
export const getProduct = async (req, res) => {
  const slug = req.params.slug;

  try {
    const product = await Product.findOne({ slug })
      .populate("category", "name")
      .populate("color", "hex name");

    if (!product) {
      return res.status(404).json({ error: "No such a product" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Products by category
export const getProductByCategory = async (req, res) => {
  const categoryId = req.body.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const products = await Product.find({ category: categoryId });

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

// Create a product
export const createProduct = async (req, res) => {
  const {
    name,
    name_AR,
    description,
    description_AR,
    price,
    weight,
    ingredients,
    ingredients_AR,
    stock,
    note,
    note_AR,
    display,
    slug,
    color,
    category,
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Please upload an image" });
  }
  const image = req.file.filename;

  try {
    const newProduct = new Product({
      name,
      name_AR,
      description,
      description_AR,
      price,
      weight,
      ingredients,
      ingredients_AR,
      stock,
      note,
      note_AR,
      display,
      slug,
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
      name_AR: req.body.name_AR,
      description: req.body.description,
      description_AR: req.body.description_AR,
      price: req.body.price,
      weight: req.body.weight,
      ingredients: req.body.ingredients,
      ingredients_AR: req.body.ingredients_AR,
      stock: req.body.stock,
      note: req.body.note,
      note_AR: req.body.note_AR,
      display: req.body.display,
      slug: req.body.slug,
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
