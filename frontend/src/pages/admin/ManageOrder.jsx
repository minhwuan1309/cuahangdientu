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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredOrders = orders?.filter((el) =>
    `${el.orderBy?.firstname} ${el.orderBy?.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-4 bg-gray-50 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b w-full bg-gray-50 flex items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Manage orders</h1>
        {editOrder && (
          <>
            <Button
              handleOnClick={handleUpdate}
              style="bg-blue-500 text-white px-4 py-2 rounded-md mx-6"
            >
              Update
            </Button>
            <Button handleOnClick={() => setEditOrder(null)}>Cancel</Button>
          </>
        )}
      </div>
      <div className="px-4 mt-6 w-full">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên khách hàng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[50%] mb-4 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none py-2 px-4 shadow-sm text-sm"
        />
        <table className="table-auto w-full px-4">
          <thead>
            <tr className="border bg-sky-900 text-white border-white">
              <th className="text-center py-2">#</th>
              <th className="text-center py-2">Ordered By</th>
              <th className="text-center py-2">Products</th>
              <th className="text-center py-2">Total</th>
              <th className="text-center py-2">Payment Methods</th>
              <th className="text-center py-2">Status</th>
              <th className="text-center py-2">Ordered Date</th>
              <th className="text-center py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders?.map((el, idx) => (
              <tr
                className="border-b hover:bg-gray-50 transition duration-150"
                key={el._id}
              >
                <td className="text-center py-2 px-2">
                  {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                    process.env.REACT_APP_LIMIT +
                    idx +
                    1}
                </td>
                <td className="text-center py-2 px-2 font-medium text-sm">
                  {el.orderBy?.firstname + " " + el.orderBy?.lastname}
                </td>
                <td className="text-center py-2 px-2">
                  <div className="max-w-sm flex flex-col gap-3">
                    {el.products?.map((n) => (
                      <div
                        key={n._id}
                        className="flex items-center gap-3 border-b pb-3 last:border-none"
                      >
                        <div className="flex text-x flex-col items-start gap-1">
                          <h3 className="font-medium text-red-500">
                            {n.title}
                          </h3>
                          <p className="text-gray-600">{n.color}</p>
                          <p className="text-gray-600">{`${n.quantity} sản phẩm`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="text-center py-2 px-1 text-green-500 font-semibold">
                  {`${formatMoney(el.total * 25000)} VNĐ`}
                </td>
                <td className="py-3 px-2 text-center">{el.paymentMethod}</td>
                <td className="text-center py-2">
                  {editOrder?._id === el._id ? (
                    <select {...register("status")} className="form-select">
                      <option value="Cancelled">Đơn hàng bị huỷ</option>
                      <option value="Succeed">Đã thanh toán</option>
                      <option value="Pending">Chưa thanh toán</option>
                    </select>
                  ) : // Chuyển đổi giá trị status trước khi hiển thị
                  el.status === "Cancelled" ? (
                    "Đơn hàng bị huỷ"
                  ) : el.status === "Succeed" ? (
                    "Đã thanh toán"
                  ) : el.status === "Pending" ? (
                    "Chưa thanh toán"
                  ) : (
                    el.status
                  ) // Nếu không phải các giá trị trên thì giữ nguyên
                  }
                </td>
                <td className="flex flex-col items-center text-center py-11">
                  <span>{moment(el.createdAt).format("DD/MM/YYYY")}</span>
                  <span>{moment(el.updatedAt).format("HH:mm:ss")}</span>
                </td>
                <td className="text-center py-2">
                  <span
                    onClick={() => {
                      setEditOrder(el);
                      setValue("status", el.status);
                    }}
                    className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1"
                  >
                    <BiEdit size={20} />
                  </span>
                  <span
                    onClick={() => handleDeleteProduct(el._id)}
                    className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1"
                  >
                    <RiDeleteBin6Line size={20} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full flex px-4 justify-end my-8">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default ManageOrder;
