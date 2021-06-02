const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      emum: ["pending", "cancel", "delivery", "done"],
      required: true,
      default: "pending",
    },
    paymentMethod: { type: String, default: "COD" },
    total: { type: Number, default: 0, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  { timestamp: true }
);

orderSchema.plugin(require("./plugins/isDeletedFalse"));

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
