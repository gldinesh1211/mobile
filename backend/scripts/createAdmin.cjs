const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple user schema for admin creation
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    await mongoose.connect('mongodb+srv://deepakk:deepakk@cluster0.pkvsd96.mongodb.net/gadgetra');
    console.log('Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gadgetra.com' });
    if (existingAdmin) {
      console.log('Admin user already exists: admin@gadgetra.com / admin123');
      process.exit(0);
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@gadgetra.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@gadgetra.com');
    console.log('🔑 Password: admin123');
    console.log('🎯 Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
