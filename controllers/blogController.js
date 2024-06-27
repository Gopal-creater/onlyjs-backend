import Blog from "../models/blogModal.js";
import factory from "./handlerFactory.js";

class BlogController {
  getAllBlog = () => factory.getAll(Blog);

  getBlog = () => factory.getOne(Blog);

  getBlogBySlug = () => factory.getOneBySlug(Blog);

  createBlog = () => factory.createOne(Blog);

  updateBlog = () => factory.updateOne(Blog);

  updateBlogBySlug = () => factory.updateOneBySlug(Blog);

  deleteBlog = () => factory.deleteOne(Blog);

  deleteBlogBySlug = () => factory.deleteOneBySlug(Blog);
}

const blogController = new BlogController();
export default blogController;
