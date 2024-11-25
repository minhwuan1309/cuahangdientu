const { formatMoney } = require ("../utils/helper");
const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const user = require("../models/user");
const order = require("../models/order");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { products, total, address, status, paymentMethod } = req.body;
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (address) {
    await User.findByIdAndUpdate(_id, { address, cart: [] });
  }
  const data = { products, total, orderBy: _id, paymentMethod };
  if (status) data.status = status;
  const newOrder = await Order.create(data);
  if (newOrder) {
    await sendOrderConfirmationEmail(user.email, newOrder);
    res.status(201).json({
      success: true,
      newOrder: newOrder,
      message: "Order created successfully",
    });
  } else {
    throw new Error("Failed to create order");
  }
});
const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Missing status");
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );
  return res.json({
    success: response ? true : false,
    mes: response ? "Updated." : "Something went wrong",
  });
});
const getUserOrders = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const { _id } = req.user;

  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  // Format lại các operators cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  const qr = { ...formatedQueries, orderBy: _id };
  console.log(qr);
  let queryCommand = Order.find(qr);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  // Execute query
  // Số lượng sp thỏa mãn điều kiện !== số lượng sp trả về 1 lần gọi API
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Order.find(qr).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      orders: response ? response : "Cannot get products",
    });
  });
});
const getOrders = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // Tách các trường đặc biệt ra khỏi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  // Format lại các operators cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  const qr = { ...formatedQueries };
  let queryCommand = Order.find(qr).populate("orderBy", "firstname lastname");

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  // Execute query
  // Số lượng sp thỏa mãn điều kiện !== số lượng sp trả về 1 lần gọi API
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Order.find(qr).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      orders: response ? response : "Cannot get products",
    });
  });
});
const deleteOrderByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rs = await Order.findByIdAndDelete(id);
  return res.json({
    success: rs ? true : false,
    mes: rs ? "Deleted" : "Something went wrong",
  });
});
function getCountPreviousDay(count = 1, date = new Date()) {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - count);
  return previous;
}
const getDashboard = asyncHandler(async (req, res) => {
  const { to, from, type } = req.query;
  const format = type === "MTH" ? "%Y-%m" : "%Y-%m-%d";
  const start = from || getCountPreviousDay(7, new Date(to));
  const end = to || getCountPreviousDay(0);
  const [users, totalSuccess, totalFailed, soldQuantities, chartData, pieData] =
    await Promise.all([
      User.aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: new Date(start) } },
              { createdAt: { $lte: new Date(end) } },
            ],
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: new Date(start) } },
              { createdAt: { $lte: new Date(end) } },
              { status: "Succeed" },
            ],
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: "$total" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: new Date(start) } },
              { createdAt: { $lte: new Date(end) } },
              { status: "Pending" },
            ],
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: "$total" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: new Date(start) } },
              { createdAt: { $lte: new Date(end) } },
              { status: "Succeed" },
            ],
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: { $sum: "$products.quantity" } },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: new Date(start) } },
              { createdAt: { $lte: new Date(end) } },
              { status: "Succeed" },
            ],
          },
        },
        { $unwind: "$createdAt" },
        {
          $group: {
            _id: {
              $dateToString: {
                format,
                date: "$createdAt",
              },
            },
            sum: { $sum: "$total" },
          },
        },
        {
          $project: {
            date: "$_id",
            sum: 1,
            _id: 0,
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: new Date(start) } },
              { createdAt: { $lte: new Date(end) } },
            ],
          },
        },
        { $unwind: "$status" },
        {
          $group: {
            _id: "$status",
            sum: { $sum: 1 },
          },
        },
        {
          $project: {
            status: "$_id",
            sum: 1,
            _id: 0,
          },
        },
      ]),
    ]);
  return res.json({
    success: true,
    data: {
      users,
      totalSuccess,
      totalFailed,
      soldQuantities,
      chartData,
      pieData,
    },
  });
});

const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_NAME,
    to: userEmail,
    subject: "Order Confirmation",
    html: `
      <h1>Thank you for your order!</h1>
      <p>Your order has been confirmed. Here are the details:</p>
      <ul>
        ${orderDetails.products
          .map(
            (product) =>
              `<li>${product.title} - ${product.quantity} - Price ${formatMoney(
                product.price
              )} VND</li>`
          )
          .join("")}
      </ul>
      <p><strong>Total:</strong> ${formatMoney(orderDetails.total*25000)} VND</p>
      <p>Payment Method: ${orderDetails.paymentMethod}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  createOrder,
  updateStatus,
  getUserOrders,
  getOrders,
  deleteOrderByAdmin,
  getDashboard,
};
