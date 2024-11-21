  import {
    apiDeleteOrderByAdmin,
    apiGetOrders,
    apiUpdateCart,
    apiUpdateStatus,
  } from "apis";
  import { Button, InputForm, Pagination } from "components";
  import useDebounce from "hooks/useDebounce";
  import moment from "moment";
  import React, { useCallback, useEffect, useState } from "react";
  import { useForm } from "react-hook-form";
  import { BiCustomize, BiEdit } from "react-icons/bi";
  import { RiDeleteBin6Line } from "react-icons/ri";
  import {
    createSearchParams,
    useLocation,
    useNavigate,
    useSearchParams,
  } from "react-router-dom";
  import { toast } from "react-toastify";
  import Swal from "sweetalert2";
  import { formatMoney } from "utils/helpers";

  const ManageOrder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [params] = useSearchParams();
    const {
      register,
      formState: { errors },
      watch,
      setValue,
    } = useForm();
    const [orders, setOrders] = useState();
    const [counts, setCounts] = useState(0);
    const [update, setUpdate] = useState(false);
    const [editOrder, setEditOrder] = useState();
    const fetchOrders = async (params) => {
      const response = await apiGetOrders({
        ...params,
        limit: process.env.REACT_APP_LIMIT,
      });
      if (response.success) {
        setCounts(response.counts);
        setOrders(response.orders);
      }
    };
    const render = useCallback(() => {
      setUpdate(!update);
    });
    const queryDecounce = useDebounce(watch("q"), 800);
    useEffect(() => {
      if (queryDecounce) {
        navigate({
          pathname: location.pathname,
          search: createSearchParams({ q: queryDecounce }).toString(),
        });
      } else
        navigate({
          pathname: location.pathname,
        });
    }, [queryDecounce]);
    useEffect(() => {
      const searchParams = Object.fromEntries([...params]);
      fetchOrders(searchParams);
    }, [params, update]);
    const handleDeleteProduct = (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Are you sure remove this order",
        icon: "warning",
        showCancelButton: true,
      }).then(async (rs) => {
        if (rs.isConfirmed) {
          const response = await apiDeleteOrderByAdmin(id);
          if (response.success) toast.success(response.mes);
          else toast.error(response.mes);
          render();
        }
      });
    };
    const handleUpdate = async () => {
      const response = await apiUpdateStatus(editOrder._id, {
        status: watch("status"),
      });
      if (response.success) {
        toast.success(response.mes);
        setUpdate(!update);
        setEditOrder(null);
      } else toast.error(response.mes);
    };
    return (
      <div className="w-full flex flex-col gap-4 bg-gray-50 relative">
        <div className="h-[69px] w-full"></div>
        <div className="p-4 border-b w-full bg-gray-50 flex items-center fixed top-0">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>
          {editOrder && (
        <div className="flex gap-4">
          <Button
            handleOnClick={handleUpdate}
            style="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Cập nhật
          </Button>
          <Button
            handleOnClick={() => setEditOrder(null)}
            style="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
          >
            Hủy
          </Button>
        </div>
      )}
    </div>

    {/* Content */}
    <div className="px-4 mt-20 w-full">
      <table className="table-auto w-full border-collapse border border-gray-300 text-gray-700 bg-white rounded-md shadow">
        <thead>
          <tr className="bg-sky-800 text-white border-b border-gray-300">
            <th className="text-center py-3 px-2">STT</th>
            <th className="text-center py-3 px-2">Tên khách hàng</th>
            <th className="text-center py-3 px-2">Sản phẩm</th>
            <th className="text-center py-3 px-2">Tổng tiền</th>
            <th className="text-center py-3 px-2">Tình trạng</th>
            <th className="text-center py-3 px-2">Ngày đặt</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.length > 0 ? (
            orders.map((el, idx) => (
              <tr
                className="border-b hover:bg-gray-50 transition duration-150"
                key={el._id}
              >
                <td className="text-center py-3 px-2 text-gray-800">
                  {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                    process.env.REACT_APP_LIMIT +
                    idx +
                    1}
                </td>
                <td className="text-center py-3 px-2 font-medium">
                  {el.orderBy?.firstname + " " + el.orderBy?.lastname}
                </td>
                <td className="text-center py-3 px-2">
                  <span className="max-w-[350px] flex flex-col gap-2">
                    {el.products?.map((n) => (
                      <span
                        key={n._id}
                        className="w-full border-b flex items-center gap-2 pb-2 last:border-none"
                      >
                        <img
                          src={n.thumbnail}
                          alt="product"
                          className="w-14 h-14 object-cover border rounded-md"
                        />
                        <span className="flex flex-col text-left text-sm text-gray-600 gap-1">
                          <h3 className="font-semibold text-red-500 text-sm">
                            {n.title}
                          </h3>
                          <span>{n.color}</span>
                          <span>{`${formatMoney(n.price)} VNĐ`}</span>
                          <span>{`${n.quantity} sản phẩm`}</span>
                        </span>
                      </span>
                    ))}
                  </span>
                </td>
                <td className="text-center py-3 px-2 text-green-500 font-semibold">
                  {`${formatMoney(el.total * 23500)} VNĐ`}
                </td>
                <td className="text-center py-3 px-2 capitalize">
                  {el.status}
                </td>
                <td className="text-center py-3 px-2">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-500">
                Không tìm thấy đơn hàng.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    <div className="w-full flex px-4 justify-end my-8">
      <Pagination totalCount={counts} />
    </div>
  </div>
  );
};

  export default ManageOrder;
