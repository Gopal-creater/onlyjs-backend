import express from "express";
import authController from "../controllers/authController.js";
import blogController from "../controllers/blogController.js";

const blogRouter = express.Router();

blogRouter
  .route("/")
  .get(blogController.getAllBlog())
  .post(
    authController.protect,
    authController.restrictTo(["admin"]),
    blogController.createBlog()
  );

blogRouter
  .route("/:id([a-fA-F0-9]{24})")
  .get(blogController.getBlog())
  .patch(
    authController.protect,
    authController.restrictTo(["admin"]),
    blogController.updateBlog()
  )
  .delete(
    authController.protect,
    authController.restrictTo(["admin"]),
    blogController.deleteBlog()
  );

blogRouter
  .route("/:slug([a-zA-Z0-9-]+)")
  .get(blogController.getBlogBySlug())
  .patch(
    authController.protect,
    authController.restrictTo(["admin"]),
    blogController.updateBlogBySlug()
  )
  .delete(
    authController.protect,
    authController.restrictTo(["admin"]),
    blogController.deleteBlogBySlug()
  );

export default blogRouter;
