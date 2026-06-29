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
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid admin email',
      ],
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

// Ensure only one Walk-in Customer exists per business/admin
customerSchema.index(
  { adminEmail: 1, isWalkIn: 1 },
  { unique: true, partialFilterExpression: { isWalkIn: true } }
);

// Ensure phone numbers are unique per business/admin
customerSchema.index(
  { adminEmail: 1, phone: 1 },
  { unique: true }
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;

