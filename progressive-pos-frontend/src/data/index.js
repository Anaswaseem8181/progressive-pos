import { DollarSign, Package, AlertTriangle, Users, CloudUpload, PackageSearch, Smartphone, WifiOff, TrendingUp, ShieldCheck, Zap, ShoppingCart, LineChart, FileDown, Star, Globe, Sun, Moon, Monitor } from "lucide-react";
export const defaultCurrency = "PKR";
export const saasCurrency = "USD";
export const businessCategory = [
  "Clothing & Apparel"
];
import adminDashboard from "../assets/images/demoPageImages/AdminDashboard.png";
import managerDashboard from "../assets/images/demoPageImages/ManagerDashboard.png";
import cashierDashboard from "../assets/images/demoPageImages/CashierDashboard.png";
import productCart from "../assets/images/demoPageImages/ProductCart.png";
import inventory from "../assets/images/demoPageImages/Inventory.png";

export const products = [
  { id: 1, name: "Jeans", size: "Medium", category: "Clothing", price: 2050, stock: 27, status: "IN STOCK" },
  { id: 2, name: "Shirt", size: "Large", category: "Clothing", price: 1020, stock: 6, status: "LOW STOCK" },
  { id: 3, name: "T-Shirt", size: "Small", category: "Clothing", price: 750, stock: 30, status: "IN STOCK" },
  { id: 4, name: "Jacket", size: "Medium", category: "Clothing", price: 3500, stock: 10, status: "IN STOCK" },
  { id: 5, name: "Hoodie", size: "Small", category: "Clothing", price: 2500, stock: 8, status: "LOW STOCK" },
  { id: 6, name: "Sweater", size: "Large", category: "Clothing", price: 1800, stock: 15, status: "IN STOCK" },
  { id: 7, name: "Kurta", size: "Medium", category: "Clothing", price: 2200, stock: 12, status: "IN STOCK" },
  { id: 8, name: "Shorts", size: "Small", category: "Clothing", price: 900, stock: 20, status: "IN STOCK" },
  { id: 9, name: "Blazer", size: "Large", category: "Clothing", price: 4200, stock: 5, status: "LOW STOCK" },
  { id: 10, name: "Tracksuit", size: "Medium", category: "Clothing", price: 3000, stock: 9, status: "LOW STOCK" },
];

// export const customers = [
//   { id: 1, name: "Walk-in Customer", phone: "0300000000", status: "REGULAR" },
//   { id: 2, name: "Anas", phone: "0309789900", status: "REGULAR" },
//   { id: 3, name: "Sarah Khan", phone: "0312987654", status: "VIP" },
//   { id: 4, name: "Ali", phone: "0300123456", status: "VIP" },
//   { id: 5, name: "Fatima", phone: "0312345678", status: "REGULAR" },
//   { id: 6, name: "Hassan", phone: "0309876543", status: "VIP" },
//   { id: 7, name: "Aisha", phone: "0312987654", status: "REGULAR" },
//   { id: 8, name: "Usman", phone: "0309876543", status: "VIP" },
//   { id: 9, name: "Noor", phone: "0312987654", status: "REGULAR" },
//   { id: 10, name: "Ahmed", phone: "0309876543", status: "VIP" },
//   { id: 11, name: "Zainab", phone: "0312987654", status: "REGULAR" },
//   { id: 12, name: "Bilal", phone: "0309876543", status: "VIP" },
//   { id: 13, name: "Sara", phone: "0312987654", status: "REGULAR" },
//   { id: 14, name: "Hamza", phone: "0309876543", status: "VIP" },
//   { id: 15, name: "Hira", phone: "0312987654", status: "REGULAR" },
// ];

export const sales = [
  {
    id: 3,
    customer: "Walk-in Customer",
    date: "01/04/2026, 08:38:36",
    amount: 2050,
    billedBy: "MANAGER (ID: 2) - MANAGER",
    items: [{ name: "Jeans", qty: 1, price: 2050 }]
  },
  {
    id: 2,
    customer: "Anas",
    date: "31/03/2026, 14:20:15",
    amount: 1600,
    billedBy: "CASHIER (ID: 3) - CASHIER",
    items: [{ name: "Chicken", qty: 2, price: 800 }]
  },
  {
    id: 1,
    customer: "Walk-in Customer",
    date: "30/03/2026, 11:15:00",
    amount: 1020,
    billedBy: "ADMIN (ID: 1) - ADMIN",
    items: [{ name: "Shirt", qty: 1, price: 1020 }]
  },
];

export const staff = [
  { id: 1, username: "admin", role: "ADMIN", email: "admin@example.com" },
  { id: 2, username: "manager", role: "MANAGER", email: "manager@example.com" },
  { id: 3, username: "cashier", role: "CASHIER", email: "cashier@example.com" },
];

export const topSelling = [
  { name: "Chicken", sold: 23, revenue: 1800 },
  { name: "Jeans", sold: 13, revenue: 26650 },
  { name: "Shirt", sold: 11, revenue: 11220 },
];

export const menuItems = [
  { name: "Dashboard", path: "/dashboard", roles: ["admin", "manager", "cashier"], icon: "LayoutDashboard" },
  { name: "Point of Sale", path: "/pos", roles: ["admin", "manager", "cashier"], icon: "ShoppingCart" },
  { name: "Inventory", path: "/inventory", roles: ["admin"], icon: "Package" },
  { name: "Customers", path: "/customers", roles: ["admin", "manager", "cashier"], icon: "Users" },
  { name: "Reports", path: "/reports", roles: ["admin", "manager"], icon: "BarChart3" },
  { name: "Staff", path: "/staff", roles: ["admin"], icon: "ShieldCheck" },
  { name: "Settings", path: "/settings", roles: ["admin", "manager", "cashier"], icon: "Settings" },
];

export const subscriptionPlans = [
  {
    id: "monthly",
    title: "Monthly Plan",
    price: 150,
    duration: "month",
    features: [
      "Full POS Access",
      "Inventory Management",
      "Sales Tracking",
      "Basic Reports",
      "Email Support",
    ],
  },
  {
    id: "yearly",
    title: "Yearly Plan",
    price: 1600,
    duration: "year",
    highlighted: true,
    features: [
      "Everything in Monthly",
      "Advanced Analytics",
      "Priority Support",
      "Multi-User Access",
      "Save 20% Annually",
    ],
  },
];

export const features = [
  {
    name: 'Inventory Classification',
    description: 'Track stock levels in real-time. Get alerts when inventory is low and automatically reorder.',
    icon: PackageSearch,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    name: 'Sales Management',
    description: 'Process transactions blazingly fast. Support multiple payment methods and custom customer receipts.',
    icon: TrendingUp,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    name: 'Offline Capabilities',
    description: 'Keep selling even when the internet goes down. Data syncs automatically once you are back online.',
    icon: WifiOff,
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    name: 'Customer CRM',
    description: 'Build loyalty by tracking customer preferences, purchase history, and contact information seamlessly.',
    icon: Users,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    name: 'Enterprise Security',
    description: 'Role-based access control ensures your staff only sees what they need to see. Data is encrypted and secure.',
    icon: ShieldCheck,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    name: 'Lightning Fast',
    description: 'Built as a Progressive Web App (PWA) to deliver a native-like experience directly in the browser.',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-600',
  },
];

export const steps = [
  {
    title: 'Add Your Inventory',
    description: 'Quickly import or manually add products with variants, barcodes, and custom pricing fields.',
    icon: FileDown,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Process Sales Quickly',
    description: 'Use the lighting-fast, barcode-compatible POS interface to check out customers and send receipts.',
    icon: ShoppingCart,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  {
    title: 'Analyze & Grow',
    description: 'View real-time dashbaords to spot sales trends, manage low stock, and make data-driven decisions.',
    icon: LineChart,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    title: 'Install Anywhere',
    description: 'Install the app directly on your home screen for a native experience without needing an app store.',
    icon: Smartphone,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Offline Reliability',
    description: 'Keep processing sales and checking inventory even when your internet goes down.',
    icon: WifiOff,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    title: 'Instant Updates',
    description: 'Get the latest features and security patches automatically without manual downloads.',
    icon: Zap,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
  },
  {
    title: 'Cloud Sync',
    description: 'Your data stays synchronized across all devices as soon as you are back online.',
    icon: CloudUpload,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
  }
];

export const testimonials = [
  {
    content: "Honestly, the offline mode saved our business...",
    author: "Sarah Jenkins",
    role: "Owner, Cloud9 Boutique",
    initials: "SJ",
    color: "bg-purple-100 text-purple-700",
    rating: 5
  },
  {
    content: "The analytics are insane...",
    author: "David Chen",
    role: "Manager, TechHaven",
    initials: "DC",
    color: "bg-blue-100 text-blue-700",
    rating: 4
  },
  {
    content: "I've used legacy POS systems...",
    author: "Maria Gonzalez",
    role: "Founder, Daily Goods Co.",
    initials: "MG",
    color: "bg-emerald-100 text-emerald-700",
    rating: 3
  }
];

export const demoScreenshots = [
  {
    id: 1,
    title: "Admin Dashboard",
    description: "High-level overview of total operations, revenue trends, and system configuration metrics.",
    category: "Dashboard",
    imagePath: adminDashboard
  },
  {
    id: 2,
    title: "Manager Activity Stream",
    description: "Real-time monitoring of cashier shifts, inventory alerts, and daily sales milestones.",
    category: "Dashboard",
    imagePath: managerDashboard
  },
  {
    id: 3,
    title: "Cashier Interface",
    description: "Simplified transaction views allowing for rapid customer checkouts.",
    category: "POS",
    imagePath: cashierDashboard
  },
  {
    id: 4,
    title: "Cart & Checkout System",
    description: "Multi-item processing, discount application, and seamless subtotal calculations natively.",
    category: "POS",
    imagePath: productCart
  },
  {
    id: 5,
    title: "Dynamic Inventory Matrix",
    description: "In-depth tracking of variants, barcode generation, and automatic low-stock tiering.",
    category: "Inventory",
    imagePath: inventory
  },
  {
    id: 6,
    title: "Offline PWA Mode",
    description: "The Progressive Web App fallback handling data seamlessly while disconnected from the cloud.",
    category: "Progressive Feature",
    imagePath: adminDashboard
  },
  {
    id: 7,
    title: "Customer Intelligence",
    description: "Built-in CRM analyzing purchase histories and mapping VIP clientele details.",
    category: "Customers",
    imagePath: adminDashboard
  },
  {
    id: 8,
    title: "Sales Analytics Engine",
    description: "Granular reporting charts, exporting to CSV, and long-term business trajectory predictions.",
    category: "Reports",
    imagePath: adminDashboard
  }
];
export const registerFeatures = [
  "Full Inventory Management",
  "Real-time Sales Analytics",
  "Offline-ready Transaction Support",
  "Role-based Staff & Permission Controls"
];

export const loginBenefits = [
  { icon: ShieldCheck, text: "256-bit SSL Encryption" },
  { icon: Globe, text: "Worldwide Access" }
];

export const trustBadges = [
  { icon: ShieldCheck, text: "Secure Payments" },
  { icon: Zap, text: "Instant Setup" },
  { icon: ShieldCheck, text: "Stripe Secure Checkout" }
];

export const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#0f172a",
      fontFamily: "'Inter', sans-serif",
      fontSmoothing: "antialiased",
      "::placeholder": { color: "#94a3b8" },
      iconColor: "#2563eb",
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
  hidePostalCode: true,
};
export const themes = [
  { id: "light", label: "Light", icon: Sun, description: "Clean and bright interface" },
  { id: "dark", label: "Dark", icon: Moon, description: "Easy on the eyes at night" },
  { id: "system", label: "System Default", icon: Monitor, description: "Follows your device setting" },
];
