import { sales as initialSales } from "../data";

const USERS_KEY = "pos_all_users";
const SALES_KEY = "pos_all_sales";

const initializeDb = () => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    const defaultUsers = [
      {
        email: "admin@gmail.com",
        password: "admin",
        name: "Demo Admin",
        businessName: "Progressive POS",
        role: "admin",
        adminEmail: "admin@gmail.com",
        currency: "PKR",
        businessCategory: "Clothing & Apparel"
      },
      {
        email: "manager@gmail.com",
        password: "manager",
        name: "Demo Manager",
        businessName: "Progressive POS",
        role: "manager",
        adminEmail: "admin@gmail.com",
        businessCategory: "Clothing & Apparel"
      },
      {
        email: "cashier@gmail.com",
        password: "cashier",
        name: "Demo Cashier",
        businessName: "Progressive POS",
        role: "cashier",
        adminEmail: "admin@gmail.com",
        businessCategory: "Clothing & Apparel"
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }

  const existingSales = localStorage.getItem(SALES_KEY);
  if (!existingSales) {
    localStorage.setItem(SALES_KEY, JSON.stringify(initialSales));
  }
};

export const mockDb = {
  getUsers: () => {
    initializeDb();
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  },

  saveUser: (user) => {
    const users = mockDb.getUsers();
    // Check if user already exists
    const index = users.findIndex(dbUser => dbUser.email === user.email);
    if (index !== -1) {
      users[index] = { ...users[index], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return user;
  },

  findUser: (email, password) => {
    const users = mockDb.getUsers();
    return users.find(dbUser => dbUser.email === email && dbUser.password === password);
  },

  getStaffForAdmin: (adminEmail) => {
    const users = mockDb.getUsers();
    return users.filter(staffMember => staffMember.adminEmail === adminEmail && staffMember.role !== 'admin');
  },

  deleteUser: (email) => {
    const users = mockDb.getUsers();
    const filtered = users.filter(dbUser => dbUser.email !== email);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  },

  // Sales/Orders
  getSales: () => {
    initializeDb();
    return JSON.parse(localStorage.getItem(SALES_KEY) || "[]");
  },

  saveSale: (sale) => {
    const sales = mockDb.getSales();
    const newSale = {
      ...sale,
      id: sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1,
      date: new Date().toLocaleString()
    };
    sales.unshift(newSale);
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
    return newSale;
  }
};
