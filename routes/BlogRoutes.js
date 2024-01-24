import express from "express";
import upload from "../middleware/Multer.js";
import { authenticate, checkRole } from "../middleware/Auth.js";
import { addBlog, addImage, addLike, deleteAll, deleteBlog, getAllBlogs, getOneBlog, removeImage, removeLike, updateBlog } from "../controllers/BlogController.js";
  
  const blogRouter = express.Router();

    blogRouter.get('/', getAllBlogs);
    blogRouter.post('/', addBlog);
    blogRouter.post('/one', getOneBlog);
    blogRouter.patch('/', updateBlog);
    blogRouter.post('/image/remove', removeImage);
    blogRouter.post('/image/add', addImage);
    blogRouter.delete('/', deleteBlog);
    blogRouter.post('/like/add', addLike);
    blogRouter.post('/like/remove', removeLike);

    blogRouter.delete('/delete/all', deleteAll);
  
  export default blogRouter;
  