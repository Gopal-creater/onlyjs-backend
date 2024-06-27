import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slugify from "slugify";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A tutorial must have a title"],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tutorial must have a description"],
    },
    blog: {
      type: String,
      required: [true, "A tutorial must have a blog"],
    },
    category: {
      type: String,
      enum: [
        "Mobile Development",
        "Frontend Development",
        "Backend Development",
        "Serverless Development",
        "Game Development",
        "Internet Of Things",
        "Data Science and Machine Learning",
        "Automation and Scripting",
      ],
      required: [true, "A tutorial must have a category"],
    },
    keywords: {
      type: [String],
      required: [true, "A tutorial must have at least one keyword"],
    },
    images: [String],
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

blogSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.blog) {
    this.blog = purify.sanitize(this.blog);
  }
  next();
});

blogSchema.plugin(mongoosePaginate);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
