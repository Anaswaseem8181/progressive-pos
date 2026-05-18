import Customer from '../models/Customer.js';

// @desc    Get all customers for an admin
// @route   GET /api/customers
// @access  Private (Admin/Manager/Cashier)
export const getCustomers = async (req, res) => {
  try {
    // Customers are linked via adminEmail
    const adminEmail = req.user.role === 'admin' ? req.user.email : req.user.adminEmail;
    const { search } = req.query;
    
    // Ensure Walk-in Customer exists for backward compatibility with existing accounts
    let walkInCustomer = await Customer.findOne({ adminEmail, isWalkIn: true });
    if (!walkInCustomer) {
      walkInCustomer = await Customer.create({
        name: 'Walk-in Customer',
        phone: '00000000000',
        status: 'REGULAR',
        adminEmail,
        isWalkIn: true
      });
    }

    let query = { adminEmail };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    let customers = await Customer.find(query).limit(20).sort({ createdAt: -1 });

    // Always ensure Walk-in Customer is at the top of the results if no search is provided
    // If a search IS provided, only include Walk-in if it matches the search.
    if (!search) {
      customers = customers.filter(c => c._id.toString() !== walkInCustomer._id.toString());
      customers.unshift(walkInCustomer);
    } else {
      // If walkIn matches the search, push it to the top
      const walkInIndex = customers.findIndex(c => c._id.toString() === walkInCustomer._id.toString());
      if (walkInIndex > 0) {
        customers.splice(walkInIndex, 1);
        customers.unshift(walkInCustomer);
      }
    }

    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a new customer
// @route   POST /api/customers
// @access  Private (Admin/Manager/Cashier)
export const addCustomer = async (req, res) => {
  try {
    const { name, phone, status } = req.body;
    const adminEmail = req.user.role === 'admin' ? req.user.email : req.user.adminEmail;

    // Optional: check if customer with same phone already exists for this admin
    const customerExists = await Customer.findOne({ phone, adminEmail });
    if (customerExists) {
      return res.status(400).json({ success: false, message: 'Customer with this phone number already exists' });
    }

    const customer = await Customer.create({
      name,
      phone,
      status: status || 'REGULAR',
      adminEmail
    });

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private (Admin/Manager/Cashier)
export const updateCustomer = async (req, res) => {
  try {
    const { name, phone, status } = req.body;
    const adminEmail = req.user.role === 'admin' ? req.user.email : req.user.adminEmail;

    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Ensure this customer belongs to the admin
    if (customer.adminEmail !== adminEmail) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this customer' });
    }

    // Check if updating phone number and it already exists for another customer
    if (phone && phone !== customer.phone) {
        const phoneExists = await Customer.findOne({ phone, adminEmail, _id: { $ne: req.params.id } });
        if (phoneExists) {
            return res.status(400).json({ success: false, message: 'Another customer with this phone number already exists' });
        }
    }

    customer.name = name || customer.name;
    customer.phone = phone || customer.phone;
    customer.status = status || customer.status;

    await customer.save();

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private (Admin/Manager)
export const deleteCustomer = async (req, res) => {
  try {
    const adminEmail = req.user.role === 'admin' ? req.user.email : req.user.adminEmail;

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Ensure this customer belongs to the admin
    if (customer.adminEmail !== adminEmail) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this customer' });
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Customer removed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
