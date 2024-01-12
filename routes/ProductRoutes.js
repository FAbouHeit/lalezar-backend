import {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductByCategory
} from "../controllers/ProductController.js";
import express from "express";
import upload from "../middleware/Multer.js";
import { paginate } from "../middleware/Pagination.js";

const productRouter = express.Router();

productRouter.get("/", paginate , getAllProducts);
productRouter.get("/product", getProduct);
productRouter.get("/byCategory" , getProductByCategory)
productRouter.post("/create", upload.single("image"), createProduct);
productRouter.patch("/update", upload.single("image"), updateProduct);
productRouter.delete('/delete' , upload.single('image') , deleteProduct)


export default productRouter;
