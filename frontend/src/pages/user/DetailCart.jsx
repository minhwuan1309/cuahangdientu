import { Breadcrumb, Button } from 'components'
import OrderItem from 'components/products/OrderItem'
import withBaseComponent from 'hocs/withBaseComponent'
import { useSelector } from 'react-redux'
import { Link, createSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { formatMoney } from 'utils/helpers'
import path from 'utils/path'

const DetailCart = ({ location, navigate }) => {
    const { currentCart, current } = useSelector(state => state.user)
    const handleSubmit = () => {
      if (currentCart?.length === 0) {
        return Swal.fire({
          icon: "info",
          title: "Giỏ hàng của bạn đang trống",
          text: "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.",
          showCancelButton: false,
          confirmButtonText: "Quay lại trang chủ",
        }).then(() => {
          navigate(`/${path.HOME}`);
        });
      }

      if (!current?.address) {
        return Swal.fire({
          icon: "info",
          title: "Chưa hoàn tất!",
          text: "Vui lòng cập nhật địa chỉ của bạn trước khi thanh toán.",
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: "Cập nhật",
          cancelButtonText: "Hủy",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate({
              pathname: `/${path.MEMBER}/${path.PERSONAL}`,
              search: createSearchParams({
                redirect: location.pathname,
              }).toString(),
            });
          }
        });
      } else {
        navigate(`/${path.CHECKOUT}`);
      }
    };
    return (
      <div className="w-full">
        {/* Tiêu đề của trang */}
        <div className="h-[81px] flex justify-center items-center bg-gray-100">
          <div className="w-main">
            <h3 className="font-semibold text-2xl uppercase">Giỏ Hàng</h3>
          </div>
        </div>

        {/* Thông tin giỏ hàng */}
        <div className="flex flex-col border w-main mx-auto my-8 rounded-lg shadow-lg">
          <div className="w-main mx-auto bg-gray-200 font-bold py-3 grid grid-cols-10 gap-2 rounded-t-lg">
            <span className="col-span-6 w-full text-center">Sản phẩm</span>
            <span className="col-span-2 w-full text-center">Số lượng</span>
            <span className="col-span-2 w-full text-center">Giá Tiền</span>
          </div>
          {currentCart?.map((el) => (
            <div
              key={el._id}
              className="flex items-center border-b p-4 bg-white rounded-lg shadow-sm my-2"
            >
              <img
                src={el.thumbnail}
                alt={el.title}
                className="w-20 h-20 object-cover rounded-md mr-4"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {el.title}
                </h3>
                <p className="text-gray-500">{el.color}</p>
              </div>
              <div className="flex items-center justify-between w-1/3">
                <span className="text-gray-700">{el.quantity} sản phẩm</span>
                <span className="text-lg font-bold text-main">
                  {formatMoney(el.price * el.quantity)} VNĐ
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="w-main mx-auto flex flex-col mb-12 justify-center items-end gap-3">
          <span className="flex items-center gap-8 text-lg font-bold text-gray-700">
            <span>Tạm tính:</span>
            <span className="text-lg font-bold text-main ">
              {`${formatMoney(
                currentCart?.reduce(
                  (sum, el) => +el?.price * el.quantity + sum,
                  0
                )
              )} VND`}
            </span>
          </span>
          <Button handleOnClick={handleSubmit}>Mua Hàng</Button>
        </div>
      </div>
    );

}

export default withBaseComponent(DetailCart)