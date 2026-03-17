# 🛍️ Gadgetra - Indian E-commerce Platform

A modern e-commerce platform for electronic gadgets with Indian localization, Google OAuth, and comprehensive admin panel.

## 🌟 Features

### 🛒 Customer Experience
- **Beautiful Login Dashboard** - Full-screen authentication interface
- **Indian Address Format** - Complete address validation with PIN codes
- **Indian Currency (INR)** - All prices displayed in Indian Rupees
- **Multiple Payment Options** - Cash on Delivery, UPI, Credit/Debit Cards
- **Product Catalog** - Advanced filtering and search
- **Shopping Cart** - Full cart management
- **Order Tracking** - Complete order lifecycle management

### 🔐 Authentication
- **Google OAuth** - One-click Google login
- **Email/Password Login** - Traditional authentication
- **JWT Tokens** - Secure session management
- **Role-based Access** - Admin and user roles

### 🛡️ Admin Panel
- **Dashboard Analytics** - Sales, orders, and user statistics
- **Product Management** - CRUD operations for products
- **Order Management** - Complete order processing
- **User Management** - Customer administration
- **Category Management** - Product categorization

### 💳 Payment Integration
- **Razorpay** - Indian payment gateway
- **Cash on Delivery** - Available across India
- **UPI Support** - PhonePe, GPay, PayTM integration

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Bootstrap 5** - Responsive UI framework
- **TypeScript** - Type-safe development
- **React Hooks** - Modern state management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Passport.js** - Authentication middleware
- **Cloudinary** - Image storage
- **Razorpay** - Payment processing

## 🗂️ Project Structure

```
gadgetra/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   ├── services/            # API services
│   ├── utils/               # Utility functions
│   └── contexts/            # React contexts
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── config/          # Configuration files
│   │   └── services/        # Business logic
│   ├── scripts/             # Database scripts
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   ```
   
   Fill in the following environment variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gadgetra
   JWT_SECRET=your-secret-key
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret
   RAZORPAY_KEY_ID=your-razorpay-key
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage

### For Customers
1. **Browse Products** - Explore electronics catalog
2. **Register/Login** - Use email or Google account
3. **Add to Cart** - Select products and quantities
4. **Checkout** - Fill Indian address format
5. **Payment** - Choose COD, UPI, or card
6. **Track Orders** - Monitor order status

### For Admins
1. **Login** - Use admin credentials
2. **Dashboard** - View analytics and statistics
3. **Products** - Add, edit, or remove products
4. **Orders** - Process and manage orders
5. **Users** - Manage customer accounts

## 🇮🇳 Indian Localization

### Currency
- All prices displayed in Indian Rupees (₹)
- Proper Indian number formatting

### Address Format
- Indian state selection (28 states + UTs)
- 6-digit PIN code validation
- Indian mobile number format (10-digit)

### Payment Options
- Cash on Delivery (available nationwide)
- UPI integration (PhonePe, GPay, PayTM)
- Credit/Debit Card via Razorpay

### Shipping
- Major cities: 1-2 business days
- Tier 2/3 cities: 3-5 business days
- Rural areas: 5-7 business days

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Update `.env` file with your credentials

### Razorpay Setup
1. Create account on [Razorpay](https://razorpay.com/)
2. Get API keys from dashboard
3. Update `.env` file with key ID and secret

### MongoDB Setup
1. Install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Update `MONGODB_URI` in `.env` file
3. Run sample data scripts to populate database

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String, // Hashed
  role: String, // 'user' or 'admin'
  googleId: String, // For OAuth users
  createdAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number, // INR
  brand: String,
  category: String,
  stock: Number,
  images: [String],
  rating: Number
}
```

### Order Model
```javascript
{
  user: ObjectId,
  products: [Object],
  totalPrice: Number,
  address: String,
  paymentMethod: String,
  status: String,
  createdAt: Date
}
```

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Sample Data
```bash
# Add sample products
cd backend
node scripts/addSampleProducts.cjs

# Create admin user
node scripts/createAdmin.cjs
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Backend (Heroku/Railway)
```bash
# Build for production
cd backend
npm run build

# Deploy to your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@gadgetra.in
- 📞 Phone: +91 80 1234 5678
- 🌐 Website: https://gadgetra.in

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Express.js](https://expressjs.com/) - Node.js framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Bootstrap](https://getbootstrap.com/) - UI framework
- [Razorpay](https://razorpay.com/) - Payment gateway

API base URL (default): `http://localhost:5000/api`

## Frontend Setup

1. `cd frontend`
2. `npm install`
3. Create `.env.local`:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```

4. `npm run dev`

Frontend dev URL: `http://localhost:3000`

