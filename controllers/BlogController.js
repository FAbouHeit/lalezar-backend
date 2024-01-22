import mongoose from "mongoose";
import Blog from "../models/BlogModel.js";
import fs from "fs";
import deleteCommentUtil from '../utils/deleteCommentUtil.js'

//add pagination
//slugs
//add bad-words 

export const addBlog = async (req, res) => {
    const { title_en,title_ar, description_en, description_ar, video } = req.body;
    const images = req.files;
    const imagePathArray = [];
    const commentArray = []; 
    
    if(images){
        for( let i=0; i<images.length; i++ ){
            imagePathArray.push(images[i].path);
        }
    }

    if (
        !title_en || 
        !description_en ||
        !title_ar ||
        !description_ar
        ) {
            if(imagePathArray.length > 0){
                for( let i=0; i<imagePathArray.length; i++ ){
                    fs.unlinkSync(imagePathArray[i]);
                }
            }
            return res.status(400).json({ 
                message: "Error! All fields are required: titles & descriptions."
            });
        }
    
    const existingBlog = await Blog.findOne({ title_en });

    if(existingBlog){
        if(imagePathArray.length > 0){
            for( let i=0; i<imagePathArray.length; i++ ){
                fs.unlinkSync(imagePathArray[i]);
            }
        }
        return res.status(400).json({ 
            message: "Error! A blog with this title_en already exists! (in English)"
        });
    }

    try{
        const newBlog = await Blog.create({
            title_en,
            title_ar,
            description_en,
            description_ar,
            images: imagePathArray,
            video,
            likes: 0,
            comments: commentArray,
          });
        await newBlog.save();

        return res.status(200).json({
            message: "Blog created successfully!"
        });

    } catch (error) {
        if(imagePathArray.length > 0){
            for( let i=0; i<imagePathArray.length; i++ ){
                fs.unlinkSync(imagePathArray[i]);
            }
        }

        return res.status(400).json({
            message: "Error! having trouble saving blog!",
            error: error.message,
        }); 
    }
};

export const getAllBlogs = async (req, res) => {

    try {
        const blogs = await Blog.find();
        
        return res.status(200).json(blogs);

      } catch (error) {

        return res.status(500).json({
             message: "Error! Can't get the blogs",
             error: error.message, 
            });
      }
}

export const getOneBlog = async (req, res) => {
    const id = req.body.id;

    try {
        if (!mongoose.isValidObjectId(id)) {
            
            return res.status(400).json({ 
                message: "Error! Invalid blog id" 
            });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ 
                message: "Error! Blog not found..." 
            });
        }

        return res.status(200).json(blog);

    } catch (error) {  

       return res.status(500).json({
            message: "Internal Server Error",
            error: error.message 
        });
    }
}

export const updateBlog = async (req, res) => {////////////////////////////////
    const {id, title_en, title_ar, description_ar, description_en} = req.body;

    if(!id){

        return res.status(404).json({
            message: "Error! No blog id provided!"
        })
    }
    if (!mongoose.isValidObjectId(id)) {
            
        return res.status(400).json({ 
            message: "Error! Invalid blog id" 
        });
    }

    try{
        const existingBlog = await Blog.findById(id);

        let updatedInfo = {
            title_en: title_en || existingBlog.title_en,
            description_en: description_en || existingBlog.description_en,
            title_ar: title_ar || existingBlog.title_ar,
            description_ar: description_ar || existingBlog.description_ar,
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, updatedInfo, {
            new: true,
          });
        
        return res.status(200).json(updatedBlog);
    } catch (error){

        return res.status(500).json({ 
            message: "Error! can't update blog",
            error: error.message
        });
    }
}

export const removeImage = async (req, res) =>{
    const {id, index} = req.body;

    if(!id){

        return res.status(404).json({
            message: "Error! No blog id provided!"
        })
    }
    if (!mongoose.isValidObjectId(id)) {
            
        return res.status(400).json({ 
            message: "Error! Invalid blog id" 
        });
    }

    try{
        const blog = await Blog.findById(id);
        const imageArray = blog.images;
        
        if(imageArray){

            if (index > -1 && index < blog.images.length) {

                fs.unlink(imageArray[index]);

                await Blog.findByIdAndUpdate(id,{
                    $set: {
                        images: imageArraysplice(index, 1),
                    }
                }, {new: false});
                
            }
        }
    } catch (error) {

        return res.status(500).json({
            message: "Error! issue updating the Blog",
            error: error.message
        })
    }

}

export const addImage = async (req, res) =>{
    const {id} = req.body;
    const image = req.file;

    if(!id){

        return res.status(404).json({
            message: "Error! No blog id provided!"
        })
    }
    if (!mongoose.isValidObjectId(id)) {
            
        return res.status(400).json({ 
            message: "Error! Invalid blog id" 
        });
    }

    try{
        const blog = await Blog.findById(id);

        const imagesArray = [...blog.images, image.path];

        await Blog.findByIdAndUpdate(id,{
            $set: {
                images: imagesArray,
            }
        }, {new: false});

    } catch (error) {

        return res.status(500).json({
            message: "Error! issue updating the Blog",
            error: error.message
        })
    }
}

export const deleteBlog = async (req, res) => {
    const id = req.body.id;

    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ 
                message: "Error! Invalid blog id" 
            });
        }

        const blog = await Blog.findById(id);

        if (blog && blog.images.length > 0){
            for( let i=0; i<images.length; i++ ){
                fs.unlinkSync(images[i]);
            }
        }

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ 
                message: "Error! Blog not found" 
            });
        }

        for(let i=0; i < deletedBlog.comments.length; i++){
            deleteCommentUtil(deletedBlog.comments[i]);
        }

        return res.status(200).json({ 
            message: "Blog deleted successfully!" 
        });

        } catch (error) {

        return res.status(500).json({ 
            message: "Error! Internal Server Error",
            error: error.message,
        });
    }
}

export const addLike = async (req ,res) => {
    const {id} = req.body.id;
    try{
        const blog = await Blog.findById(id);

        if (!blog) {

            return res.status(500).json({
                message: "Error! Can't find blog to add like to."
            })
          } else {

                blog.likes += 1;
                await blog.save();
          }
    } catch(error) {

        return res.status(500).json({ 
            message: "Error! Internal Server Error",
            error: error.message,
        });
    }
}

export const removeLike = async (req ,res) => {
    const {id} = req.body.id;
    try{
        const blog = await Blog.findById(id);

        if (!blog) {

            return res.status(500).json({
                message: "Error! Can't find blog to add like to."
            })
        } else {

            if(blog.likes>0){
                blog.likes -= 1;
                await blog.save();
            }
        }
    } catch(error) {

        return res.status(500).json({ 
            message: "Error! Internal Server Error",
            error: error.message,
        });
    }
}

///////////////////////////////////////////////////////////////////
export const deleteAll = async (req,res) => {
    try {
      const result = await Blog.deleteMany({});
    
    return res.status(200).json({ 
        message: "Deleted All rows successfully!",
    }); 
  
    } catch (error) {

        return res.status(500).json({ 
            message: "Error! Can't delete all rows",
            error: error.message,
        }); 
    }
  };

