import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const tutorialSchema = new mongoose.Schema(
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
    images: [String],
  },
  { timestamps: true }
);

tutorialSchema.plugin(mongoosePaginate);

const Tutorial = mongoose.model("Tutorial", tutorialSchema);

export default Tutorial;
