import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a customer name'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a customer phone number'],
    },
    status: {
      type: String,
      enum: ['REGULAR', 'VIP', 'INACTIVE'],
      default: 'REGULAR',
    },
    adminEmail: {
      type: String,
      required: [true, 'Customer must be linked to a business admin'],
    },
    isWalkIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
