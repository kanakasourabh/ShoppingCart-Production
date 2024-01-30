import slugify from "slugify";
import Category from "../model/categoryModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "Name is required",
      });
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category already exists",
      });
    }
    const category = await new Category({ name, slug: slugify(name) }).save();
    res.status(201).send({
      success: true,
      message: "New Category Created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category",
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      suceess: false,
      error,
      message: "Error while updating category",
    });
  }
};

export const categoryController = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send({
      success: true,
      message: "All Categories list",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching categories",
    });
  }
}; 

export const singleCategoryController = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    res.status(200).send({
      status: true,
      message: "Successfully fetched category for the given slug",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching category for the given id",
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "Delete successfull",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Category Delete unsuccessfull",
      error,
    });
  }
};
