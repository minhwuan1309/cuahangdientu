import React, { useEffect, useState } from "react";
import payment from "assets/payment.svg";
import { useSelector } from "react-redux";
import { formatMoney, calculateTotal } from "utils/helpers";
import { Congrat, Paypal } from "components";
import withBaseComponent from "hocs/withBaseComponent";
import { getCurrent } from "store/user/asyncActions";
import Swal from "sweetalert2";
import { apiCreateOrder } from "apis";
import { Link } from "react-router-dom";

const Checkout = ({ dispatch, navigate }) => {
  const { currentCart, current } = useSelector((state) => state.user);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    if (isSuccess) dispatch(getCurrent());
  }, [isSuccess]);

  useEffect(() => {
    if (paymentMethod === "COD") {
      const total = Math.round(
        +currentCart?.reduce((sum, el) => +el?.price * el.quantity + sum, 0)
      );
      Swal.fire({
        icon: "info",
        title: "Thanh toán",
        text: `Vui lòng trả bằng tiền mặt số tiền ${formatMoney(
          total
        )} VNĐ khi nhận hàng.`,
        showConfirmButton: true,
        confirmButtonText: "Thanh toán",
        showCancelButton: true,
        cancelButtonText: "Quay lại",
      }).then((result) => {
        if (result.isConfirmed) {
          handleSaveOrder();
        } else {
          setPaymentMethod("");
        }
      });
    }
  }, [paymentMethod]);

  const handleSaveOrder = async () => {
    const payload = {
      products: currentCart,
      total: Math.round(
        +currentCart?.reduce((sum, el) => +el?.price * el.quantity + sum, 0) /
          25000
      ),
      address: current?.address,
      paymentMethod
    };
    const response = await apiCreateOrder({ ...payload, status: "Pending" });
    if (response.success) {
      setIsSuccess(true);
      setTimeout(() => {
        Swal.fire("Congrat!", "Order was created.", "success").then(() => {
          navigate("/");
        });
      }, 1500);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {isSuccess && <Congrat />}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 flex items-center justify-center h-[600px]">
          <img
            src={payment}
            alt="payment"
            className="w-[80%] h-[90%] object-contain"
          />
        </div>

        <div className="col-span-8 space-y-6">
          <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-2xl font-semibold mb-4">Danh sách sản phẩm</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-3 text-left">Tên sản phẩm</th>
                  <th className="p-3 text-center">Số lượng</th>
                  <th className="p-3 text-right">Giá</th>
                </tr>
              </thead>
              <tbody>
                {currentCart?.map((el) => (
                  <tr
                    className="border-b border-gray-300 hover:bg-gray-50"
                    key={el._id}
                  >
                    <td className="p-3">{el.title}</td>
                    <td className="p-3 text-center">{el.quantity}</td>
                    <td className="p-3 text-right">
                      {formatMoney(el.price) + " VND"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white shadow-md rounded p-4">
            <div className="flex justify-between text-lg mb-2">
              <span className="font-medium">Tổng tiền:</span>
              <span className="text-main font-bold">{`${formatMoney(
                currentCart?.reduce(
                  (sum, el) => +el?.price * el.quantity + sum,
                  0
                )
              )} VND`}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-medium">Địa chỉ:</span>
              <span className="text-main font-bold">{current?.address}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-md border border-gray-300">
            <h3 className="text-lg font-semibold mb-3">
              Chọn phương thức thanh toán
            </h3>
            <select
              onChange={(e) => setPaymentMethod(e.target.value)}
              value={paymentMethod}
              className="w-full border rounded-md px-4 py-2"
            >
              <option value="">-- Chọn --</option>
              <option value="COD">Thanh toán khi nhận hàng</option>
              <option value="PAYPAL">Thanh toán Paypal</option>
              <option value="MOMO">Thanh toán Momo</option>
            </select>
            {paymentMethod === "PAYPAL" && (
              <div className="mt-4">
                <Paypal
                  payload={{
                    products: currentCart,
                    total: Math.round(
                      +currentCart?.reduce(
                        (sum, el) => +el?.price * el.quantity + sum,
                        0
                      ) / 25000
                    ),
                    address: current?.address,
                    paymentMethod
                  }}
                  setIsSuccess={setIsSuccess}
                  amount={Math.round(
                    +currentCart?.reduce(
                      (sum, el) => +el?.price * el.quantity + sum,
                      0
                    ) / 25000
                  )}
                />
              </div>
            )}
          </div>
          <div className="text-center mt-4">
            <Link to="/">
              <button className="w-full px-8 py-3 text-red-500 border border-gray-300 rounded-md bg-white hover:bg-red-500 hover:text-white hover:shadow-lg transition-all duration-200">
                Quay lại
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(Checkout);
