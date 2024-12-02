import { apiCreateCategory } from "apis";
import { Button, InputForm } from "components";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getBase64 } from "utils/helpers";
const CreateCategory = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState([""]); // Manage dynamic brands
  const [preview, setPreview] = useState({ image: null });

  // Add a new brand input field
  const addBrandField = () => setBrands((prev) => [...prev, ""]);

  // Remove a brand input field by index
  const removeBrandField = (index) =>
    setBrands((prev) => prev.filter((_, i) => i !== index));

  // Handle change in a specific brand input
  const handleBrandChange = (index, value) => {
    const updatedBrands = [...brands];
    updatedBrands[index] = value;
    setBrands(updatedBrands);
  };

  // Preview thumbnail
  const handlePreviewThumb = async (file) => {
    if (!file) return;
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, image: base64Thumb }));
  };

  // Watch for thumb changes
  useEffect(() => {
    const thumbFile = watch("image")?.[0];
    if (thumbFile) {
      handlePreviewThumb(thumbFile);
    }
  }, [watch("image")]);

  // Handle form submission
const handlePublish = async (data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("brand", JSON.stringify(brands));
  formData.append("image", data.image[0]); // Ensure image is appended correctly

  for (const [key, value] of formData.entries()) {
    console.log(key, value); // Log the FormData content
  }

  try {
    const response = await apiCreateCategory(formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.success) {
      console.log("Category created:", response);
    } else {
      console.error("Failed to create category:", response);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <div className="w-full flex flex-col gap-6 bg-gray-100 p-6 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-semibold text-gray-700">
          Create New Category
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(handlePublish)}
        className="space-y-6 flex flex-col"
      >
        {/* Category Name */}
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-2">
            Category Name
          </label>
          <InputForm
            id="title"
            register={register}
            errors={errors}
            validate={{
              required: "Category name is required.",
            }}
            placeholder="Enter category name"
          />
        </div>
        {/* Brands */}
        <div className="space-y-2 py-4">
          <label className="font-semibold text-xl">Thương hiệu</label>
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border rounded-md p-2 bg-white"
            >
              <input
                type="text"
                value={brand}
                onChange={(e) => handleBrandChange(index, e.target.value)}
                placeholder={`Brand ${index + 1}`}
                className="border p-2 w-full rounded-md"
              />
              <Button
                handleOnClick={() => removeBrandField(index)}
                className="text-red-500"
              >
                Xoá
              </Button>
            </div>
          ))}
          <Button handleOnClick={addBrandField}>Thêm thương hiệu</Button>
        </div>
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-2">
            Hình ảnh
          </label>
          <input
            type="file"
            id="image"
            {...register("image", { required: "This field cannot be empty." })}
            className="border p-2 w-full rounded-md"
          />
          {errors.image && (
            <small className="text-xs text-red-500">
                {errors.image.message}
              </small>
          )}
        </div>
        {/* Preview Thumbnail */}
        {preview.image && (
          <div className="py-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Preview
            </label>
            <img
              src={preview.image}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md shadow-md"
            />
          </div>
        )}
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-6 py-2 rounded-md text-white ${
              isLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );

};

export default CreateCategory;
