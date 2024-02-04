import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategorySum
} from "../controllers/CategoryController.js";
import express from "express";

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/sum", getCategorySum);
categoryRouter.post("/create", createCategory);
categoryRouter.patch("/update/:id", updateCategory);
categoryRouter.delete('/delete/:id',deleteCategory)

export default categoryRouter;
