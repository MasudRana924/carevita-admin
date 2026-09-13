import {
  _id,
  _price,
  _times,
  _company,
  _boolean,
  _fullName,
  _taskNames,
  _postTitles,
  _description,
  _productNames,
} from './_mock';

// ----------------------------------------------------------------------

export const _myAccount = {
      displayName: 'Masud Rana',
  email: 'demo@innovatica.com',
  photoURL: '/assets/images/avatar/avatar-25.webp',
};

// ----------------------------------------------------------------------

export const _users = [...Array(24)].map((_, index) => ({
  id: _id(index),
  name: _fullName(index),
  company: _company(index),
  isVerified: _boolean(index),
  avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  status: index % 4 ? 'active' : 'banned',
  role:
    [
      'Leader',
      'Hr Manager',
      'UI Designer',
      'UX Designer',
      'UI/UX Designer',
      'Project Manager',
      'Backend Developer',
      'Full Stack Designer',
      'Front End Developer',
      'Full Stack Developer',
    ][index] || 'UI Designer',
}));

// ----------------------------------------------------------------------

export const _posts = [...Array(23)].map((_, index) => ({
  id: _id(index),
  title: _postTitles(index),
  description: _description(index),
  coverUrl: `/assets/images/cover/cover-${index + 1}.webp`,
  totalViews: 8829,
  totalComments: 7977,
  totalShares: 8556,
  totalFavorites: 8870,
  postedAt: _times(index),
  author: {
    name: _fullName(index),
    avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  },
}));

// ----------------------------------------------------------------------

const COLORS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

export const _products = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: _id(index),
    price: _price(index),
    name: _productNames(index),
    priceSale: setIndex % 3 ? null : _price(index),
    coverUrl: `/assets/images/product/product-${setIndex}.webp`,
    colors:
      (setIndex === 1 && COLORS.slice(0, 2)) ||
      (setIndex === 2 && COLORS.slice(1, 3)) ||
      (setIndex === 3 && COLORS.slice(2, 4)) ||
      (setIndex === 4 && COLORS.slice(3, 6)) ||
      (setIndex === 23 && COLORS.slice(4, 6)) ||
      (setIndex === 24 && COLORS.slice(5, 6)) ||
      COLORS,
    status:
      ([1, 3, 5].includes(setIndex) && 'sale') || ([4, 8, 12].includes(setIndex) && 'new') || '',
  };
});

// ----------------------------------------------------------------------

export const _langs = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/flags/ic-flag-en.svg',
  },
  {
    value: 'de',
    label: 'German',
    icon: '/assets/icons/flags/ic-flag-de.svg',
  },
  {
    value: 'fr',
    label: 'French',
    icon: '/assets/icons/flags/ic-flag-fr.svg',
  },
];

// ----------------------------------------------------------------------

export const _timeline = [...Array(5)].map((_, index) => ({
  id: _id(index),
  title: [
    '1983, orders, $4220',
    '12 Invoices have been paid',
    'Order #37745 from September',
    'New order placed #XF-2356',
    'New order placed #XF-2346',
  ][index],
  type: `order${index + 1}`,
  time: _times(index),
}));

export const _traffic = [
  {
    value: 'facebook',
    label: 'Facebook',
    total: 19500,
  },
  {
    value: 'google',
    label: 'Google',
    total: 91200,
  },
  {
    value: 'linkedin',
    label: 'Linkedin',
    total: 69800,
  },
  {
    value: 'twitter',
    label: 'Twitter',
    total: 84900,
  },
];

export const _tasks = Array.from({ length: 5 }, (_, index) => ({
  id: _id(index),
  name: _taskNames(index),
}));

// ----------------------------------------------------------------------

export const _notifications = [
  {
    id: _id(1),
    title: 'Your order is placed',
    description: 'waiting for shipping',
    avatarUrl: null,
    type: 'order-placed',
    postedAt: _times(1),
    isUnRead: true,
  },
  {
    id: _id(2),
    title: _fullName(2),
    description: 'answered to your comment on the Innovatica',
    avatarUrl: '/assets/images/avatar/avatar-2.webp',
    type: 'friend-interactive',
    postedAt: _times(2),
    isUnRead: true,
  },
  {
    id: _id(3),
    title: 'You have new message',
    description: '5 unread messages',
    avatarUrl: null,
    type: 'chat-message',
    postedAt: _times(3),
    isUnRead: false,
  },
  {
    id: _id(4),
    title: 'You have new mail',
    description: 'sent from Guido Padberg',
    avatarUrl: null,
    type: 'mail',
    postedAt: _times(4),
    isUnRead: false,
  },
  {
    id: _id(5),
    title: 'Delivery processing',
    description: 'Your order is being shipped',
    avatarUrl: null,
    type: 'order-shipped',
    postedAt: _times(5),
    isUnRead: false,
  },
  {
    id: _id(6),
    title: 'Payment received',
    description: 'Order #12345 payment confirmed',
    avatarUrl: null,
    type: 'order-placed',
    postedAt: _times(6),
    isUnRead: true,
  },
  {
    id: _id(7),
    title: 'New customer registered',
    description: 'Sarah Johnson joined your platform',
    avatarUrl: '/assets/images/avatar/avatar-7.webp',
    type: 'friend-interactive',
    postedAt: _times(7),
    isUnRead: false,
  },
  {
    id: _id(8),
    title: 'System maintenance',
    description: 'Scheduled maintenance in 2 hours',
    avatarUrl: null,
    type: 'mail',
    postedAt: _times(8),
    isUnRead: false,
  },
  {
    id: _id(9),
    title: 'Inventory alert',
    description: 'Low stock for Product XYZ',
    avatarUrl: null,
    type: 'order-placed',
    postedAt: _times(9),
    isUnRead: true,
  },
  {
    id: _id(10),
    title: 'Order delivered',
    description: 'Order #12346 has been delivered',
    avatarUrl: null,
    type: 'order-shipped',
    postedAt: _times(10),
    isUnRead: false,
  },
  {
    id: _id(11),
    title: 'New review received',
    description: '5-star review for your service',
    avatarUrl: '/assets/images/avatar/avatar-11.webp',
    type: 'friend-interactive',
    postedAt: _times(11),
    isUnRead: false,
  },
  {
    id: _id(12),
    title: 'Support ticket updated',
    description: 'Ticket #45678 has been resolved',
    avatarUrl: null,
    type: 'chat-message',
    postedAt: _times(12),
    isUnRead: false,
  },
];

// ----------------------------------------------------------------------

export const _orders = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;
  const statuses = ['pending', 'pickup', 'delivered'];
  const status = statuses[index % 3];
  
  return {
    id: _id(index),
    orderNumber: `ORD-${String(setIndex).padStart(4, '0')}`,
    customerName: _fullName(index),
    customerEmail: `${_fullName(index).toLowerCase().replace(/\s+/g, '.')}@example.com`,
    customerPhone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    customerAddress: `${Math.floor(Math.random() * 9999) + 1} ${['Main St', 'Oak Ave', 'Pine Rd', 'Elm Blvd', 'Cedar Ln'][index % 5]}, ${['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][index % 5]}, ${['NY', 'CA', 'IL', 'TX', 'AZ'][index % 5]} ${String(Math.floor(Math.random() * 90000) + 10000)}`,
    items: [
      {
        id: _id(index * 2),
        name: _productNames(index),
        price: _price(index),
        quantity: Math.floor(Math.random() * 5) + 1,
        image: `/assets/images/product/product-${(index % 24) + 1}.webp`,
      },
      ...(index % 3 === 0 ? [{
        id: _id(index * 2 + 1),
        name: _productNames((index + 1) % 24),
        price: _price((index + 1) % 24),
        quantity: Math.floor(Math.random() * 3) + 1,
        image: `/assets/images/product/product-${((index + 1) % 24) + 1}.webp`,
      }] : []),
    ],
    subtotal: _price(index) * (Math.floor(Math.random() * 5) + 1),
    shipping: 15.99,
    tax: _price(index) * 0.08,
    total: _price(index) * (Math.floor(Math.random() * 5) + 1) + 15.99 + (_price(index) * 0.08),
    status,
    paymentMethod: ['Credit Card', 'PayPal', 'Cash on Delivery'][index % 3],
    paymentStatus: ['paid', 'pending', 'failed'][index % 3],
    orderDate: _times(index),
    estimatedDelivery: new Date(Date.now() + (index % 7 + 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: index % 4 === 0 ? 'Please deliver before 6 PM' : '',
    trackingNumber: index % 2 === 0 ? `TRK${String(Math.floor(Math.random() * 900000) + 100000)}` : null,
  };
});

// ----------------------------------------------------------------------

// Enhanced ERP Mock Data

export const _inventory = [...Array(30)].map((_, index) => ({
  id: _id(index),
  sku: `SKU-${String(index + 1).padStart(4, '0')}`,
  name: _productNames(index % 24),
  category: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Automotive'][index % 6],
  quantity: Math.floor(Math.random() * 1000) + 50,
  minQuantity: Math.floor(Math.random() * 50) + 10,
  maxQuantity: Math.floor(Math.random() * 2000) + 500,
  unitPrice: _price(index),
  totalValue: _price(index) * (Math.floor(Math.random() * 1000) + 50),
  location: ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Store 1', 'Store 2'][index % 5],
  supplier: _company(index),
  lastUpdated: _times(index),
  status: ['In Stock', 'Low Stock', 'Out of Stock', 'Discontinued'][index % 4],
  image: `/assets/images/product/product-${(index % 24) + 1}.webp`,
}));

export const _suppliers = [...Array(20)].map((_, index) => ({
  id: _id(index),
  name: _company(index),
  email: `${_fullName(index).toLowerCase().replace(/\s+/g, '.')}@${_company(index).toLowerCase().replace(/[^a-z]/g, '')}.com`,
  phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  address: `${Math.floor(Math.random() * 9999) + 1} ${['Main St', 'Oak Ave', 'Pine Rd', 'Elm Blvd', 'Cedar Ln'][index % 5]}, ${['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][index % 5]}, ${['NY', 'CA', 'IL', 'TX', 'AZ'][index % 5]} ${String(Math.floor(Math.random() * 90000) + 10000)}`,
  category: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Automotive'][index % 6],
  status: ['Active', 'Inactive', 'Pending'][index % 3],
  totalOrders: Math.floor(Math.random() * 1000) + 50,
  totalSpent: _price(index) * (Math.floor(Math.random() * 10000) + 1000),
  lastOrderDate: _times(index),
  paymentTerms: ['Net 30', 'Net 60', 'Net 90', 'Cash on Delivery'][index % 4],
}));

export const _customers = [...Array(25)].map((_, index) => ({
  id: _id(index % 24),
  name: _fullName(index % 24),
  email: `${_fullName(index % 24).toLowerCase().replace(/\s+/g, '.')}@example.com`,
  phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  address: `${Math.floor(Math.random() * 9999) + 1} ${['Main St', 'Oak Ave', 'Pine Rd', 'Elm Blvd', 'Cedar Ln'][index % 5]}, ${['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][index % 5]}, ${['NY', 'CA', 'IL', 'TX', 'AZ'][index % 5]} ${String(Math.floor(Math.random() * 90000) + 10000)}`,
  company: index % 3 === 0 ? _company(index % 24) : null,
  customerType: ['Individual', 'Business', 'VIP'][index % 3],
  status: ['Active', 'Inactive', 'Pending'][index % 3],
  totalOrders: Math.floor(Math.random() * 100) + 1,
  totalSpent: _price(index % 24) * (Math.floor(Math.random() * 1000) + 100),
  lastOrderDate: _times(index % 24),
  registrationDate: _times((index + 5) % 24),
  avatarUrl: `/assets/images/avatar/avatar-${(index % 24) + 1}.webp`,
}));

export const _employees = [...Array(15)].map((_, index) => ({
  id: _id(index % 24),
  employeeId: `EMP-${String(index + 1).padStart(4, '0')}`,
  name: _fullName(index % 24),
  email: `${_fullName(index % 24).toLowerCase().replace(/\s+/g, '.')}@company.com`,
  phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  department: ['Sales', 'Marketing', 'IT', 'HR', 'Finance', 'Operations', 'Customer Service'][index % 7],
  position: ['Manager', 'Senior', 'Junior', 'Lead', 'Associate'][index % 5],
  hireDate: _times(index % 24),
  salary: _price(index % 24) * 1000,
  status: ['Active', 'Inactive', 'On Leave'][index % 3],
  manager: index > 0 ? _fullName((index - 1) % 24) : null,
  avatarUrl: `/assets/images/avatar/avatar-${(index % 24) + 1}.webp`,
}));

export const _departments = [
  { id: _id(0), name: 'Sales', manager: _fullName(0), employeeCount: 12, budget: 500000 },
  { id: _id(1), name: 'Marketing', manager: _fullName(1), employeeCount: 8, budget: 300000 },
  { id: _id(2), name: 'IT', manager: _fullName(2), employeeCount: 15, budget: 800000 },
  { id: _id(3), name: 'HR', manager: _fullName(3), employeeCount: 6, budget: 200000 },
  { id: _id(4), name: 'Finance', manager: _fullName(4), employeeCount: 10, budget: 400000 },
  { id: _id(5), name: 'Operations', manager: _fullName(5), employeeCount: 20, budget: 600000 },
  { id: _id(6), name: 'Customer Service', manager: _fullName(6), employeeCount: 14, budget: 350000 },
];

export const _projects = [...Array(12)].map((_, index) => ({
  id: _id(index % 24),
  name: `Project ${index + 1}`,
  description: _description(index % 24),
  manager: _fullName(index % 24),
  team: _users.slice(0, Math.floor(Math.random() * 5) + 3).map(user => user.name),
  startDate: _times(index % 24),
  endDate: new Date(Date.now() + (index % 12 + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'][index % 5],
  priority: ['Low', 'Medium', 'High', 'Critical'][index % 4],
  budget: _price(index % 24) * 10000,
  spent: _price(index % 24) * (Math.floor(Math.random() * 8000) + 2000),
  progress: Math.floor(Math.random() * 100),
}));

export const _invoices = [...Array(20)].map((_, index) => ({
  id: _id(index % 24),
  invoiceNumber: `INV-${String(index + 1).padStart(4, '0')}`,
  customerName: _fullName(index % 24),
  customerEmail: `${_fullName(index % 24).toLowerCase().replace(/\s+/g, '.')}@example.com`,
  issueDate: _times(index % 24),
  dueDate: new Date(Date.now() + (index % 30 + 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'][index % 5],
  subtotal: _price(index % 24) * (Math.floor(Math.random() * 10) + 1),
  tax: _price(index % 24) * 0.08,
  total: _price(index % 24) * (Math.floor(Math.random() * 10) + 1) * 1.08,
  items: [
    {
      id: _id((index * 2) % 24),
      name: _productNames(index % 24),
      quantity: Math.floor(Math.random() * 5) + 1,
      price: _price(index % 24),
      total: _price(index % 24) * (Math.floor(Math.random() * 5) + 1),
    }
  ],
}));

export const _expenses = [...Array(18)].map((_, index) => ({
  id: _id(index % 24),
  description: _description(index % 24),
  category: ['Office Supplies', 'Travel', 'Marketing', 'Equipment', 'Software', 'Utilities', 'Rent', 'Insurance'][index % 8],
  amount: _price(index % 24) * (Math.floor(Math.random() * 100) + 10),
  date: _times(index % 24),
  employee: _fullName(index % 24),
  department: ['Sales', 'Marketing', 'IT', 'HR', 'Finance', 'Operations'][index % 6],
  status: ['Pending', 'Approved', 'Rejected', 'Paid'][index % 4],
  receipt: index % 3 === 0 ? `/assets/images/receipts/receipt-${index + 1}.pdf` : null,
}));

export const _purchases = [...Array(15)].map((_, index) => ({
  id: _id(index % 24),
  purchaseNumber: `PO-${String(index + 1).padStart(4, '0')}`,
  supplier: _company(index % 24),
  supplierContact: _fullName(index % 24),
  orderDate: _times(index % 24),
  expectedDelivery: new Date(Date.now() + (index % 14 + 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: ['Draft', 'Sent', 'Confirmed', 'Shipped', 'Received', 'Cancelled'][index % 6],
  items: [
    {
      id: _id((index * 2) % 24),
      name: _productNames(index % 24),
      quantity: Math.floor(Math.random() * 100) + 10,
      unitPrice: _price(index % 24),
      total: _price(index % 24) * (Math.floor(Math.random() * 100) + 10),
    }
  ],
  subtotal: _price(index % 24) * (Math.floor(Math.random() * 1000) + 100),
  tax: _price(index % 24) * 0.08,
  shipping: 25.00,
  total: _price(index % 24) * (Math.floor(Math.random() * 1000) + 100) * 1.08 + 25.00,
}));

export const _reports = [
  {
    id: _id(0),
    name: 'Sales Report',
    type: 'sales',
    period: 'Monthly',
    lastGenerated: _times(0),
    status: 'Generated',
  },
  {
    id: _id(1),
    name: 'Inventory Report',
    type: 'inventory',
    period: 'Weekly',
    lastGenerated: _times(1),
    status: 'Generated',
  },
  {
    id: _id(2),
    name: 'Financial Report',
    type: 'financial',
    period: 'Quarterly',
    lastGenerated: _times(2),
    status: 'Pending',
  },
  {
    id: _id(3),
    name: 'Employee Report',
    type: 'employee',
    period: 'Monthly',
    lastGenerated: _times(3),
    status: 'Generated',
  },
];

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export const _categories = [...Array(12)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: _id(index),
    name: [
      'Electronics',
      'Clothing',
      'Food & Beverages',
      'Automotive',
      'Home & Garden',
      'Sports & Recreation',
      'Books & Media',
      'Health & Beauty',
      'Toys & Games',
      'Office Supplies',
      'Jewelry',
      'Pet Supplies',
    ][index] || 'Category',
    description: [
      'Electronic devices and gadgets',
      'Fashion and apparel items',
      'Food and beverage products',
      'Automotive parts and accessories',
      'Home and garden supplies',
      'Sports equipment and recreation items',
      'Books, movies, and media content',
      'Health and beauty products',
      'Toys and games for all ages',
      'Office and school supplies',
      'Jewelry and accessories',
      'Pet food and supplies',
    ][index] || 'Category description',
    imageUrl: `/assets/images/product/product-${setIndex}.webp`,
    status: index % 3 ? 'active' : 'inactive',
    createdAt: _times(index),
  };
});

// Purchase Orders Mock Data
export const _purchaseOrders = [...Array(20)].map((_, index) => {
  const setIndex = index + 1;
  const statuses = ['Draft', 'Sent', 'Confirmed', 'Shipped', 'Received', 'Cancelled'];
  const status = statuses[index % 6];
  
  return {
    id: _id(index),
    poNumber: `PO-${String(setIndex).padStart(4, '0')}`,
    supplierId: _suppliers[index % _suppliers.length].id,
    supplierName: _suppliers[index % _suppliers.length].name,
    supplierEmail: _suppliers[index % _suppliers.length].email,
    orderDate: _times(index),
    expectedDelivery: new Date(Date.now() + (index % 30 + 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status,
    priority: ['Low', 'Medium', 'High', 'Urgent'][index % 4],
    items: [
      {
        id: _id(index * 2),
        productId: _products[index % _products.length].id,
        productName: _products[index % _products.length].name,
        quantity: Math.floor(Math.random() * 100) + 10,
        unitPrice: _price(index),
        total: _price(index) * (Math.floor(Math.random() * 100) + 10),
        receivedQuantity: status === 'Received' ? Math.floor(Math.random() * 100) + 10 : 0,
      },
      ...(index % 3 === 0 ? [{
        id: _id(index * 2 + 1),
        productId: _products[(index + 1) % _products.length].id,
        productName: _products[(index + 1) % _products.length].name,
        quantity: Math.floor(Math.random() * 50) + 5,
        unitPrice: _price((index + 1) % 24),
        total: _price((index + 1) % 24) * (Math.floor(Math.random() * 50) + 5),
        receivedQuantity: status === 'Received' ? Math.floor(Math.random() * 50) + 5 : 0,
      }] : []),
    ],
    subtotal: _price(index) * (Math.floor(Math.random() * 1000) + 100),
    tax: _price(index) * 0.08,
    shipping: 25.00,
    total: _price(index) * (Math.floor(Math.random() * 1000) + 100) * 1.08 + 25.00,
    notes: index % 4 === 0 ? 'Please deliver before 5 PM' : '',
    approvedBy: index % 2 === 0 ? _employees[index % _employees.length].name : null,
    approvedDate: index % 2 === 0 ? _times(index) : null,
    deliveryAddress: `${Math.floor(Math.random() * 9999) + 1} ${['Main St', 'Oak Ave', 'Pine Rd', 'Elm Blvd', 'Cedar Ln'][index % 5]}, ${['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][index % 5]}, ${['NY', 'CA', 'IL', 'TX', 'AZ'][index % 5]} ${String(Math.floor(Math.random() * 90000) + 10000)}`,
  };
});

// Supplier Quotes Mock Data
export const _supplierQuotes = [...Array(15)].map((_, index) => {
  const setIndex = index + 1;
  const statuses = ['Pending', 'Submitted', 'Approved', 'Rejected', 'Expired'];
  const status = statuses[index % 5];
  
  return {
    id: _id(index),
    quoteNumber: `QT-${String(setIndex).padStart(4, '0')}`,
    supplierId: _suppliers[index % _suppliers.length].id,
    supplierName: _suppliers[index % _suppliers.length].name,
    requestDate: _times(index),
    submissionDate: status !== 'Pending' ? _times(index + 1) : null,
    validUntil: new Date(Date.now() + (index % 30 + 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status,
    priority: ['Low', 'Medium', 'High'][index % 3],
    items: [
      {
        id: _id(index * 2),
        productName: _products[index % _products.length].name,
        description: _description(index % 24),
        quantity: Math.floor(Math.random() * 100) + 10,
        unitPrice: _price(index),
        total: _price(index) * (Math.floor(Math.random() * 100) + 10),
        specifications: 'High quality, durable material',
        deliveryTime: `${Math.floor(Math.random() * 14) + 3} days`,
      },
    ],
    subtotal: _price(index) * (Math.floor(Math.random() * 1000) + 100),
    tax: _price(index) * 0.08,
    shipping: 15.00,
    total: _price(index) * (Math.floor(Math.random() * 1000) + 100) * 1.08 + 15.00,
    terms: ['Net 30', 'Net 60', 'Cash on Delivery'][index % 3],
    notes: index % 3 === 0 ? 'Bulk discount available for orders over $1000' : '',
    contactPerson: _fullName(index % 24),
    contactEmail: `${_fullName(index % 24).toLowerCase().replace(/\s+/g, '.')}@supplier.com`,
    contactPhone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  };
});

// HR Management Mock Data
export const _attendance = [...Array(100)].map((_, index) => {
  const employee = _employees[index % _employees.length];
  const date = new Date(Date.now() - (index % 30) * 24 * 60 * 60 * 1000);
  
  return {
    id: _id(index),
    employeeId: employee.employeeId,
    employeeName: employee.name,
    date: date.toISOString().split('T')[0],
    checkIn: `08:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}:00`,
    checkOut: `17:${String(Math.floor(Math.random() * 30) + 30).padStart(2, '0')}:00`,
    totalHours: Math.floor(Math.random() * 2) + 8,
    status: ['Present', 'Late', 'Absent', 'Half Day'][index % 4],
    overtime: Math.floor(Math.random() * 3),
    notes: index % 10 === 0 ? 'Work from home' : '',
  };
});

export const _leaveRequests = [...Array(25)].map((_, index) => {
  const employee = _employees[index % _employees.length];
  const leaveTypes = ['Annual Leave', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 'Paternity Leave'];
  const statuses = ['Pending', 'Approved', 'Rejected', 'Cancelled'];
  
  return {
    id: _id(index),
    employeeId: employee.employeeId,
    employeeName: employee.name,
    leaveType: leaveTypes[index % leaveTypes.length],
    startDate: new Date(Date.now() + (index % 30 + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + (index % 30 + 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalDays: Math.floor(Math.random() * 5) + 1,
    status: statuses[index % statuses.length],
    reason: ['Family vacation', 'Medical appointment', 'Personal emergency', 'Wedding', 'Conference'][index % 5],
    submittedDate: _times(index),
    approvedBy: index % 2 === 0 ? _employees[(index + 1) % _employees.length].name : null,
    approvedDate: index % 2 === 0 ? _times(index + 1) : null,
    notes: index % 4 === 0 ? 'Approved with conditions' : '',
  };
});

export const _performanceReviews = [...Array(20)].map((_, index) => {
  const employee = _employees[index % _employees.length];
  const reviewers = ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement', 'Poor'];
  
  return {
    id: _id(index),
    employeeId: employee.employeeId,
    employeeName: employee.name,
    reviewPeriod: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'][index % 4],
    reviewDate: _times(index),
    reviewer: _employees[(index + 1) % _employees.length].name,
    overallRating: Math.floor(Math.random() * 5) + 1,
    performance: reviewers[index % reviewers.length],
    strengths: ['Team player', 'Good communication', 'Technical skills', 'Leadership', 'Problem solving'][index % 5],
    areasForImprovement: ['Time management', 'Communication', 'Technical skills', 'Leadership', 'Documentation'][index % 5],
    goals: ['Improve productivity', 'Enhance skills', 'Take on more responsibilities', 'Mentor junior staff', 'Complete certification'][index % 5],
    comments: 'Overall good performance with room for improvement in specific areas.',
    nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };
});

export const _payroll = [...Array(30)].map((_, index) => {
  const employee = _employees[index % _employees.length];
  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][index % 12];
  
  return {
    id: _id(index),
    employeeId: employee.employeeId,
    employeeName: employee.name,
    month,
    year: 2024,
    basicSalary: employee.salary,
    allowances: Math.floor(Math.random() * 1000) + 500,
    overtime: Math.floor(Math.random() * 500) + 100,
    bonuses: index % 3 === 0 ? Math.floor(Math.random() * 2000) + 500 : 0,
    grossPay: employee.salary + Math.floor(Math.random() * 1000) + 500 + Math.floor(Math.random() * 500) + 100,
    deductions: Math.floor(Math.random() * 800) + 200,
    netPay: employee.salary + Math.floor(Math.random() * 1000) + 500 + Math.floor(Math.random() * 500) + 100 - (Math.floor(Math.random() * 800) + 200),
    paymentDate: _times(index),
    status: ['Paid', 'Pending', 'Processing'][index % 3],
    paymentMethod: ['Bank Transfer', 'Check', 'Cash'][index % 3],
    notes: index % 5 === 0 ? 'Bonus included for outstanding performance' : '',
  };
});

// Sales Reports Mock Data
export const _salesReports = [...Array(12)].map((_, index) => {
  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][index];
  
  return {
    id: _id(index),
    month,
    year: 2024,
    totalOrders: Math.floor(Math.random() * 500) + 100,
    totalRevenue: Math.floor(Math.random() * 100000) + 50000,
    totalCost: Math.floor(Math.random() * 60000) + 30000,
    grossProfit: Math.floor(Math.random() * 40000) + 20000,
    netProfit: Math.floor(Math.random() * 30000) + 15000,
    averageOrderValue: Math.floor(Math.random() * 200) + 100,
    topSellingProduct: _products[index % _products.length].name,
    topCustomer: _customers[index % _customers.length].name,
    growthRate: (Math.random() * 20 - 10).toFixed(2), // -10% to +10%
    generatedDate: _times(index),
  };
});

// Customer Purchase History Mock Data
export const _customerPurchaseHistory = [...Array(50)].map((_, index) => {
  const customer = _customers[index % _customers.length];
  const product = _products[index % _products.length];
  
  return {
    id: _id(index),
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    orderId: _orders[index % _orders.length].id,
    orderNumber: _orders[index % _orders.length].orderNumber,
    productId: product.id,
    productName: product.name,
    productCategory: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Automotive'][index % 6],
    quantity: Math.floor(Math.random() * 5) + 1,
    unitPrice: product.price,
    totalAmount: product.price * (Math.floor(Math.random() * 5) + 1),
    purchaseDate: _times(index),
    paymentMethod: ['Credit Card', 'PayPal', 'Cash on Delivery'][index % 3],
    orderStatus: ['Completed', 'Shipped', 'Delivered', 'Returned'][index % 4],
    reviewRating: Math.floor(Math.random() * 5) + 1,
    reviewComment: index % 3 === 0 ? 'Great product, fast delivery!' : '',
  };
});

// Inventory Turnover Reports Mock Data
export const _inventoryTurnoverReports = [...Array(20)].map((_, index) => {
  const product = _products[index % _products.length];
  const category = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Automotive'][index % 6];
  
  return {
    id: _id(index),
    productId: product.id,
    productName: product.name,
    category,
    sku: `SKU-${String(index + 1).padStart(4, '0')}`,
    beginningInventory: Math.floor(Math.random() * 1000) + 100,
    endingInventory: Math.floor(Math.random() * 500) + 50,
    averageInventory: Math.floor(Math.random() * 750) + 75,
    costOfGoodsSold: Math.floor(Math.random() * 50000) + 10000,
    turnoverRatio: (Math.random() * 10 + 2).toFixed(2), // 2-12 times
    daysToSell: Math.floor(365 / (Math.random() * 10 + 2)),
    lastUpdated: _times(index),
    status: ['High Turnover', 'Medium Turnover', 'Low Turnover', 'Slow Moving'][index % 4],
    recommendations: ['Increase stock', 'Reduce stock', 'Maintain current level', 'Discontinue'][index % 4],
  };
});

// Delivery Scheduling Mock Data
export const _deliverySchedules = [...Array(15)].map((_, index) => {
  const order = _orders[index % _orders.length];
  const statuses = ['Scheduled', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed', 'Rescheduled'];
  
  return {
    id: _id(index),
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerAddress: order.customerAddress,
    customerPhone: order.customerPhone,
    scheduledDate: new Date(Date.now() + (index % 7 + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: `${Math.floor(Math.random() * 12) + 8}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    actualDeliveryDate: index % 3 === 0 ? new Date(Date.now() + (index % 7 + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
    actualDeliveryTime: index % 3 === 0 ? `${Math.floor(Math.random() * 12) + 8}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : null,
    status: statuses[index % statuses.length],
    driverName: _fullName(index % 24),
    driverPhone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    vehicleNumber: `VAN-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
    trackingNumber: `TRK${String(Math.floor(Math.random() * 900000) + 100000)}`,
    notes: index % 4 === 0 ? 'Customer requested delivery before 6 PM' : '',
    deliveryAttempts: Math.floor(Math.random() * 3) + 1,
  };
});

// Cost Tracking Mock Data
export const _costTracking = [...Array(30)].map((_, index) => {
  const categories = ['Raw Materials', 'Labor', 'Overhead', 'Marketing', 'Administrative', 'Shipping', 'Utilities', 'Rent'];
  const types = ['Fixed', 'Variable', 'Semi-variable'];
  
  return {
    id: _id(index),
    date: _times(index),
    category: categories[index % categories.length],
    description: _description(index % 24),
    amount: Math.floor(Math.random() * 10000) + 100,
    type: types[index % types.length],
    department: ['Production', 'Sales', 'Marketing', 'IT', 'HR', 'Finance', 'Operations'][index % 7],
    supplier: index % 3 === 0 ? _suppliers[index % _suppliers.length].name : null,
    invoiceNumber: index % 3 === 0 ? `INV-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}` : null,
    paymentStatus: ['Paid', 'Pending', 'Overdue'][index % 3],
    paymentDate: index % 3 === 0 ? _times(index) : null,
    approvedBy: _employees[index % _employees.length].name,
    notes: index % 5 === 0 ? 'Monthly recurring expense' : '',
  };
});
