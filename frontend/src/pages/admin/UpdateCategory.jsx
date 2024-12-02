import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiGetCategoryById, apiUpdateCategory } from "apis";
import { Button, InputForm, Loading } from "components";

const UpdateCategory = () => {
  const { pcid } = useParams(); // Extract category ID from URL
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch category details
  useEffect(() => {
    if (!pcid) {
      toast.error("Category ID is missing.");
      return;
    }

    const fetchCategory = async () => {
      try {
        const response = await apiGetCategoryById(pcid);
        if (response.success) {
          const { title, brand, image } = response.productCategory;
          setValue("title", title);
          setValue("image", image);
          setBrands(brand || []);
        } else {
          toast.error(response.message || "Failed to load category details.");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("An error occurred while loading category details.");
      }
    };

    fetchCategory();
  }, [pcid,setValue]);




  // Brand input handlers
  const addBrandField = () => setBrands([...brands, ""]);
  const removeBrandField = (index) =>
    setBrands(brands.filter((_, i) => i !== index));
  const handleBrandChange = (index, value) => {
    const updatedBrands = [...brands];
    updatedBrands[index] = value;
    setBrands(updatedBrands);
  };

  // Submit form
  const handleUpdateCategory = async (data) => {
    setIsLoading(true);
    try {
      const response = await apiUpdateCategory(
        { ...data, brand: brands },
        pcid
      );
      if (response.success) {
        toast.success("Category updated successfully!");
        navigate("/manage-categories"); // Navigate back to category management
      } else {
        toast.error("Failed to update category.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the category.");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-gray-50 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b w-full bg-gray-50 justify-between flex items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Update Category</h1>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <form
          onSubmit={handleSubmit(handleUpdateCategory)}
          className="px-4 flex flex-col gap-4"
        >
          {/* Category Name */}
          <div className="grid grid-cols-1 gap-4 text-xl">
            <InputForm
              label="Category Name"
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
            <label className="font-semibold text-xl">Brands</label>
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
                  Remove
                </Button>
              </div>
            ))}
            <Button handleOnClick={addBrandField}>Add Brand</Button>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="font-semibold text-xl">Thumbnail:</label>
            <input
              type="file"
              {...register("image")}
              className="border p-2 w-full rounded-md"
            />
            {errors.image && (
              <span className="text-red-500 text-sm">
                {errors.image.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateCategory;
