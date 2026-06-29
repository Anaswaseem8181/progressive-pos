import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'cashier'],
      default: 'admin',
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: function() {
        return this.role === 'admin' ? this._id : null;
      }
    },
    businessName: {
      type: String,
      default: 'Progressive POS',
    },
    businessCategory: {
      type: String,
      default: 'Clothing & Apparel',
    },
    currency: {
      type: String,
      default: 'PKR',
    },
    storeAddress: {
      type: String,
      default: '',
    },
    contactNumber: {
      type: String,
      required: [true, 'Please add a contact number'],
      match: [
        /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
        'Please add a valid Pakistani phone number',
      ],
    },
    adminEmail: {
      type: String,
      required: true,
      default: function() {
        return this.role === 'admin' ? this.email : '';
      }
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    subscriptionPlan: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    billingStatus: {
      type: String,
      enum: ['active', 'past_due', 'canceled', 'unpaid'],
      default: 'unpaid',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password & track change timestamp
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Only set passwordChangedAt for existing users (not on initial registration)
  if (!this.isNew) {
    this.passwordChangedAt = Date.now();
  }
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
