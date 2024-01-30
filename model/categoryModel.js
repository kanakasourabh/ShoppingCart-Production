import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});

const Category = model("Category", categorySchema);

export default Category;
