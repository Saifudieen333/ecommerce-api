const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('./db/connectDB');

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // CLEANUP: Delete all existing data in correct order
    console.log('\n🗑️  Cleaning up old data...');
    await Order.deleteMany({});
    console.log('   Deleted all Orders');
    await Product.deleteMany({});
    console.log('   Deleted all Products');
    await Category.deleteMany({});
    console.log('   Deleted all Categories');
    await User.deleteMany({});
    console.log('   Deleted all Users');

    // CREATE SAMPLE DATA

    // 1. Create Users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'customer'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'customer'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      }
    ]);
    console.log(`\n✅ Created ${users.length} Users`);

    // 2. Create Categories
    const categories = await Category.create([
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        slug: 'electronics'
      },
      {
        name: 'Clothing',
        description: 'Fashion and apparel',
        slug: 'clothing'
      },
      {
        name: 'Books',
        description: 'Books and literature',
        slug: 'books'
      }
    ]);
    console.log(`✅ Created ${categories.length} Categories`);

    // 3. Create Products (with correct category references)
    const products = await Product.create([
      {
        name: 'iPhone 15 Pro',
        description: 'Latest Apple smartphone with advanced features',
        price: 999.99,
        stock: 50,
        category: categories[0]._id, // Electronics
        images: ['iphone15.jpg', 'iphone15-back.jpg'],
        inStock: true
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Flagship Android smartphone',
        price: 899.99,
        stock: 75,
        category: categories[0]._id, // Electronics
        images: ['galaxy-s24.jpg'],
        inStock: true
      },
      {
        name: 'Sony Headphones',
        description: 'Wireless noise-canceling headphones',
        price: 299.99,
        stock: 100,
        category: categories[0]._id, // Electronics
        images: ['sony-headphones.jpg'],
        inStock: true
      },
      {
        name: 'Nike Air Max',
        description: 'Comfortable running shoes',
        price: 129.99,
        stock: 200,
        category: categories[1]._id, // Clothing
        images: ['nike-airmax.jpg'],
        inStock: true
      },
      {
        name: 'Levi\'s Jeans',
        description: 'Classic blue denim jeans',
        price: 59.99,
        stock: 150,
        category: categories[1]._id, // Clothing
        images: ['levis-jeans.jpg'],
        inStock: true
      },
      {
        name: 'The Great Gatsby',
        description: 'Classic American novel by F. Scott Fitzgerald',
        price: 14.99,
        stock: 300,
        category: categories[2]._id, // Books
        images: ['gatsby.jpg'],
        inStock: true
      }
    ]);
    console.log(`✅ Created ${products.length} Products`);

    // Success message
    console.log('\n🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Total Categories: ${categories.length}`);
    console.log(`   Total Products: ${products.length}`);
    console.log('\n📝 You can now test your API!');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    // Disconnect from database
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seed function
seedData();