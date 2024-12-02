const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const createCategory = asyncHandler(async (req, res) => {
  const { title, brand } = req.body;

  if (!title || !brand) {
    return res.status(400).json({ success: false, message: "Missing inputs" });
  }

  const image = req.file?.path; // Correctly access the uploaded image
  if (!image) {
    return res.status(400).json({
      success: false,
      message: "Image upload failed",
    });
  }

  try {
    const response = await ProductCategory.create({ ...req.body, image });
    return res.json({
      success: true,
      message: "Category created successfully",
      createdCategory: response,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create category!" });
  }
});


const getCategories = asyncHandler(async (req, res) => {
  const response = await ProductCategory.find();
  return res.json({
    success: response ? true : false,
    prodCategories: response ? response : "Không thể tạo mới dự liệu",
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { pcid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pcid)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid category ID format." });
  }

  const productCategory = await ProductCategory.findById(pcid);
  if (!productCategory) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found." });
  }

  res.status(200).json({ success: true, productCategory });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updatedCategory: response ? response : "Cannot update product-category",
  });
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const response = await ProductCategory.findByIdAndDelete(pcid);
  return res.json({
    success: response ? true : false,
    deletedCategory: response ? response : "Cannot delete product-category",
  });
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
