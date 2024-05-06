import mongoose from "mongoose";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A topic must have a title"],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A topic must have a description"],
    },
    markdown: {
      type: String,
      required: true,
    },
    tutorial: {
      type: mongoose.Schema.ObjectId,
      ref: "Tutorial",
      required: [true, "Topic must belong to a tutorial"],
    },
    images: [String],
  },
  { timestamps: true }
);

//The pre middleware with the hook "validate" is executed before the document undergoes validation
topicSchema.pre("validate", function (next) {
  if (this.markdown) {
    this.markdown = purify.sanitize(this.markdown);
  }
  next();
});

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;
