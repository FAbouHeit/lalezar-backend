import {
  getAllProducts,
  getProductByName,
  getAllProductsWithPaginate,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductByCategory,
  getProductsDash
} from "../controllers/ProductController.js";
import express from "express";
import upload from "../middleware/Multer.js";
import { paginate } from "../middleware/Pagination.js";

const productRouter = express.Router();

productRouter.get('/paginate',paginate, getAllProductsWithPaginate);
productRouter.get("/", getAllProducts);
productRouter.get('/dash' , getProductsDash)
productRouter.get("/product/:slug", getProduct);
productRouter.get("/byCategory" ,paginate , getProductByCategory)
productRouter.post("/create", upload.single("image"), createProduct);
productRouter.patch("/update", upload.single("image"), updateProduct);
productRouter.delete('/delete' , upload.single('image') , deleteProduct)
productRouter.get("/searchByName/:name", getProductByName);


export default productRouter;
