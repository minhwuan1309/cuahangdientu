const mongoose = require("mongoose") 

var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        color: String,
        price: Number,
        thumbnail: String,
        title: String,
      },
    ],
    status: {
      type: String,
      default: "Cancelled",
      enum: ["Cancelled", "Succeed", "Pending"],
    },
    total: Number,
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "PAYPAL", "MOMO"],
      required: true, 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema)
