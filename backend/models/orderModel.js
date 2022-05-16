import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, trim: true },
        price: { type: Number, required: true, trim: true },
        image: { type: String, required: true, trim: true },
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          trim: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
      trim: true,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
      trim: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
      trim: true,
    },
    isShipped: {
      type: Boolean,
      required: true,
      default: false,
    },
    shippedAt: {
      type: Date,
      trim: true,
    },
    trackingNumber: {
      type: String,
      required: false,
      trim: true,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
      trim: true,
    },
  },

  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
