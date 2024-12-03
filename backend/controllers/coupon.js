const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')

const createNewCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Vui lòng nhập đủ thông tin!");

  const response = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });

  return res.json({
    success: !!response,
    createdCoupon: response || "Không thể tạo mã giảm giá mới",
  });
});

const getCoupons = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select("-createdAt -updatedAt");
  return res.json({
    success: !!response,
    coupons: response || "Không thể lấy mã giảm giá",
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (Object.keys(req.body).length === 0)
    throw new Error("Vui lòng nhập đủ thông tin!");

  if (req.body.expiry)
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;

  const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });

  return res.json({
    success: !!response,
    updatedCoupon: response || "Không thể cập nhật mã giảm giá",
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Coupon.findByIdAndDelete(cid);

  return res.json({
    success: !!response,
    deletedCoupon: response || "Không thể xóa mã giảm giá",
  });
});


module.exports = {
    createNewCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon
}