import mongoose from "mongoose";
import Color from "./ColorModel.js";
import Category from "./CategoryModel.js";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "Price must be a positive number",
      },
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    stock: {
      type: Boolean,
      required: true,
    },
    note: {
      type: String,
    },
    display: {
      type: Boolean,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;


