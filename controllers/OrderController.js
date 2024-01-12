import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";

export const addOrder = async (req, res) => {
  const { number, status, userId, orderDetails, address, country, city } =
    req.body;
  try {
    if ((!number, !userId, !orderDetails, !address, !country, !city)) {
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
        (item) => item.productId.toString() === product._id.toString()
      );

      if (!orderItem) {
        return res.status(404).json({ error: "Product not found" });
      }

      return {
        ...product.toObject(),
        quantity: orderItem.quantity,
        priceAll: orderItem.priceAll,
      };
    });
    const totalPrice = updatedProducts.reduce(
      (total, product) => total + product.priceAll,
      0
    );

    const order = await Order.create({
      number: number,
      status: "Initiated" || status,
      userId: userId,
      orderDetails: updatedProducts,
      totalPrice: totalPrice,
      country: country,
      city: city,
      address: address,
    });

    res.status(200).json({ message: "Order added successfully", data: order });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};

// Edit Order
export const editOrder = async (req, res) => {
  const id = req.body.id;
  const { number, status, orderDetails, address, country, city } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ error: "No id" });
    }

    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (orderDetails) {
      const productIds = orderDetails.map((item) => item.productId);
      const products = await Product.find({ _id: { $in: productIds } });

      // Calculate the total price for each product
      var updatedProducts = products.map((product) => {
        const orderItem = orderDetails.find(
          (item) => item.productId.toString() === product._id.toString()
        );

        if (!orderItem) {
          return res.status(404).json({ error: "Product not found" });
        }

        return {
          ...product.toObject(),
          quantity: orderItem.quantity,
          priceAll: orderItem.priceAll,
        };
      });

      var totalPrice = updatedProducts.reduce(
        (total, product) => total + product.priceAll,
        0
      );
    }

    existingOrder.number = number || existingOrder.number;
    existingOrder.status = status || existingOrder.status;
    existingOrder.orderDetails = updatedProducts || existingOrder.orderDetails;
    existingOrder.totalPrice = totalPrice || existingOrder.totalPrice;
    existingOrder.address = address || existingOrder.address;
    existingOrder.country = country || existingOrder.country;
    existingOrder.city = city || existingOrder.city;

    const updatedOrder = await existingOrder.save();

    res
      .status(200)
      .json({ message: "Order updated successfully", data: updatedOrder });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};

// Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId");
    res.status(200).json({ data: orders });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};

// Get Order By Id
export const getOrderById = async (req, res) => {
  const id = req.body.id;

  try {
    const order = await Order.findById(id).populate("userId");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ data: order });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};

// Delete Order
export const deleteOrder = async (req, res) => {
  const id = req.body.id;

  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order deleted successfully", data: order });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};
