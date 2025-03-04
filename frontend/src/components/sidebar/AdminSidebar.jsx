import React, { memo, Fragment, useState } from "react";
import logo from "assets/logo.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { AiOutlineCaretDown, AiOutlineCaretRight } from "react-icons/ai";
import { RiShareForwardLine } from "react-icons/ri";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"; // Thêm icon cho nút toggle
import withBaseComponent from "hocs/withBaseComponent";
import { useSelector } from "react-redux";
import { adminSidebar } from "utils/contants";

const activedStyle =
  "px-4 py-2 flex items-center gap-2 bg-blue-500 text-gray-100";
const notActivedStyle = "px-4 py-2 flex items-center gap-2 hover:bg-blue-100";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [actived, setActived] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Trạng thái hiển thị Sidebar
  const { current } = useSelector((state) => state.user);

  const handleShowTabs = (tabID) => {
    if (actived.some((el) => el === tabID))
      setActived((prev) => prev.filter((el) => el !== tabID));
    else setActived((prev) => [...prev, tabID]);
  };

  const renderSidebarItems = () => {
    if (!current) return [];

    const role = +current.role;
    if (role === 1945) {
      return adminSidebar.filter((item) =>
        [
          "Tổng quát",
          "Quản lý tài khoản",
          "Sản phẩm",
          "Quản lý đơn hàng",
          "Loại sản phẩm",
          "Bài viết",
        ].includes(item.text)
      );
    } else if (role === 1980) {
      return adminSidebar.filter((item) =>
        ["Sản phẩm", "Quản lý đơn hàng", "Bài viết"].includes(item.text)
      );
    }
    return [];
  };

  return (
    <div className="relative text-base">
      {/* Nút ẩn/hiện Sidebar */}
      <div
        className="absolute top-4 left-4 z-50 cursor-pointer text-gray-700"
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
      >
        {isSidebarVisible ? (
          <HiOutlineX size={24} /> // Icon đóng
        ) : (
          <HiOutlineMenu size={24} /> // Icon mở
        )}
      </div>

      {/* Sidebar */}
      <div
        className={clsx(
          "bg-white h-full py-4 transition-transform duration-300",
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Link
          to={"/"}
          className="flex flex-col justify-center items-center p-4 gap-2"
        >
          <img src={logo} alt="logo" className="w-[180px] object-contain" />
          <div className="h-[50px]"></div>
        </Link>
        <div className="cursor-pointer">
          {renderSidebarItems().map((el) => (
            <Fragment key={el.id}>
              {el.type === "SINGLE" && (
                <NavLink
                  to={el.path}
                  className={({ isActive }) =>
                    clsx(isActive && activedStyle, !isActive && notActivedStyle)
                  }
                >
                  <span>{el.icon}</span>
                  <span>{el.text}</span>
                </NavLink>
              )}
              {el.type === "PARENT" && (
                <div
                  onClick={() => handleShowTabs(+el.id)}
                  className="flex flex-col"
                >
                  <div className="flex items-center justify-between px-4 py-2 hover:bg-blue-100 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span>{el.icon}</span>
                      <span>{el.text}</span>
                    </div>
                    {actived.some((id) => id === el.id) ? (
                      <AiOutlineCaretRight />
                    ) : (
                      <AiOutlineCaretDown />
                    )}
                  </div>
                  {actived.some((id) => +id === +el.id) && (
                    <div className="flex flex-col">
                      {el.submenu.map((item, idx) => (
                        <NavLink
                          key={idx}
                          to={item.path}
                          onClick={(e) => e.stopPropagation()}
                          className={({ isActive }) =>
                            clsx(
                              isActive && activedStyle,
                              !isActive && notActivedStyle,
                              "pl-16"
                            )
                          }
                        >
                          {item.text}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Fragment>
          ))}
          <div onClick={() => navigate(`/`)} className={notActivedStyle}>
            <span>
              <RiShareForwardLine />
            </span>
            <span>Về trang chính</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(AdminSidebar);
