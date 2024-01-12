import mongoose from "mongoose";
import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import Product from "../models/Product.js";

export const addOrder = async (req, res) => {
  const { status, userId, orderDetails, address } = req.body;
  try {
    if ((!status, !userId, !orderDetails, !address)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const productIds = orderDetails.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    // Calculate the total price for each product
    const updatedProducts = products.map((product) => {
      const orderItem = orderDetails.find(
        (item) => item.id.toString() === product._id.toString()
      );
      const quantity = orderItem ? orderItem.quantity : 0;
      const totalPrice = product.price * quantity;

      return {
        ...product.toObject(),
        quantity,
        totalPrice,
      };
    });

    // Calculate the total order price
    const totalPrice = updatedProducts.reduce(
      (total, product) => total + product.totalPrice,
      0
    );

    const order = await Order.create({
      status: "Initiated",
      userId: userId,
      orderDetails: updatedProducts,
      totalPrice: totalPrice,
      address: address,
    });

    res
      .status(200)
      .json({ message: "Order added successfully", data: order });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};
