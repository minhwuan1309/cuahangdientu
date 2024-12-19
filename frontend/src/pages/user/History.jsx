import { apiGetOrders, apiGetUserOrders } from "apis"
import { CustomSelect, InputForm, Pagination } from "components"
import withBaseComponent from "hocs/withBaseComponent"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createSearchParams, useSearchParams } from "react-router-dom"
import { statusOrders } from "utils/contants"
import { formatMoney } from "utils/helpers"

const History = ({ navigate, location }) => {
  const [orders, setOrders] = useState(null)
  const [counts, setCounts] = useState(0)
  const [params] = useSearchParams()
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm()
  const q = watch("q")
  const status = watch("status")
  const fetchPOrders = async (params) => {
    const response = await apiGetUserOrders({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    })
    if (response.success) {
      setOrders(response.orders)
      setCounts(response.counts)
    }
  }
  useEffect(() => {
    const pr = Object.fromEntries([...params])
    fetchPOrders(pr)
  }, [params])

  const handleSearchStatus = ({ value }) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ status: value }).toString(),
    })
  }

  return (
    <div className="w-full relative px-4">
      <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
        Lịch sử mua hàng
      </header>
      <div className="flex justify-end items-center px-4">
        <form className="w-[45%] grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <InputForm
              id="q"
              register={register}
              errors={errors}
              fullWidth
              placeholder="Search orders by status,..."
            />
          </div>
          <div className="col-span-1 flex items-center">
            <CustomSelect
              options={statusOrders}
              value={status}
              onChange={(val) => handleSearchStatus(val)}
              wrapClassname="w-full"
            />
          </div>
        </form>
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr className="border bg-sky-900 text-white border-white">
            <th className="text-center py-2">#</th>
            <th className="text-center py-2">Sản phẩm</th>
            <th className="text-center py-2">Tổng tiền</th>
            <th className="text-center py-2">Trạng thái thanh toán</th>
            <th className="text-center py-2">Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((el, idx) => (
            <tr className="border-b" key={el._id}>
              <td className="text-center py-2">
                {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                  process.env.REACT_APP_LIMIT +
                  idx +
                  1}
              </td>
              <td className="text-center py-2 px-4">
                <div className="max-w-sm flex flex-col gap-3">
                  {el.products?.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-3 border-b pb-3 last:border-none"
                    >
                      <img
                        src={product.thumbnail}
                        alt="thumb"
                        className="w-8 h-8 rounded-md object-cover"
                      />
                      <div className="flex text-x flex-col items-start gap-1">
                        <h3 className="font-medium text-red-500">{product.title}</h3>
                        <p className="text-gray-600">{product.color}</p>
                        <p className="text-gray-600">{`${product.quantity} sản phẩm`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </td>
              <td className="text-center py-2">{`${formatMoney(
                el.total * 25000
              )} VNĐ`}</td>
              <td className="text-center py-2">
                {el.status === "Cancelled"
                  ? "Đơn hàng bị huỷ"
                  : el.status === "Succeed"
                  ? "Đã thanh toán"
                  : el.status === "Pending"
                  ? "Chưa thanh toán"
                  : el.status}
              </td>
              <td className="flex flex-col items-center text-center py-11">
                <span>{moment(el.createdAt).format("DD/MM/YYYY")}</span>
                <span>{moment(el.updatedAt).format("HH:mm:ss")}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full flex justify-end my-8">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
}

export default withBaseComponent(History)
