import React, { useEffect, useState } from "react";
import { apiGetBlogs } from "../../apis/blog"; // Sử dụng API từ file blog.js
import { Pagination } from "../../components"; // Component phân trang nếu có

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  // Hàm gọi API để lấy danh sách blogs
  const fetchBlogs = async (page = 1) => {
    try {
      const response = await apiGetBlogs({ page });
      if (response && response.data) {
        setBlogs(response.data.blogs);
        setTotalBlogs(response.data.totalCount);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  // Gọi API mỗi khi trang hiện tại thay đổi
  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  return (
    <div className="w-full">
      <div className="h-[81px] flex justify-center items-center bg-gray-100">
        <div className="lg:w-main w-screen px-4 lg:px-0">
          <h3 className="font-semibold uppercase">Blogs</h3>
        </div>
      </div>
      <div className="mt-8 w-main m-auto grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {blogs.map((blog) => (
          <div key={blog._id} className="border p-4 rounded-md">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-[200px] object-cover mb-4"
            />
            <h4 className="font-semibold text-lg">{blog.title}</h4>
            <p className="text-sm text-gray-600 mt-2">{blog.excerpt}</p>
          </div>
        ))}
      </div>
      <div className="w-main m-auto my-4 flex justify-end">
        <Pagination
          totalCount={totalBlogs}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default BlogsPage;
