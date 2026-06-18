require('dotenv').config();

const mongoose = require('mongoose');
const UserModel = require('../src/model/user.model');
const Product = require('../src/model/product.model');

const users = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.seed@example.com',
    mobile: '+919876543210',
    password: 'Password@123'
  },
  {
    name: 'Meera Kapoor',
    email: 'meera.seed@example.com',
    mobile: '+919876543211',
    password: 'Password@123'
  },
  {
    name: 'Kabir Verma',
    email: 'kabir.seed@example.com',
    mobile: '+919876543212',
    password: 'Password@123'
  }
];

const products = [
  {
    name: 'wireless bluetooth headphones',
    description: 'Comfortable over-ear headphones with clear sound and long battery life.',
    price: 2499,
    category: 'electronics',
    images: ['headphones-1.jpg', 'headphones-2.jpg']
  },
  {
    name: 'cotton casual t-shirt',
    description: 'Soft breathable cotton t-shirt for everyday wear.',
    price: 599,
    category: 'fashion',
    images: ['tshirt-1.jpg']
  },
  {
    name: 'stainless steel water bottle',
    description: 'Durable insulated bottle that keeps drinks hot or cold for hours.',
    price: 899,
    category: 'home',
    images: ['bottle-1.jpg']
  },
  {
    name: 'ergonomic office chair',
    description: 'Adjustable office chair with lumbar support for long working hours.',
    price: 7499,
    category: 'furniture',
    images: ['chair-1.jpg', 'chair-2.jpg']
  },
  {
    name: 'running sports shoes',
    description: 'Lightweight running shoes with cushioned sole and breathable mesh.',
    price: 3299,
    category: 'sports',
    images: ['shoes-1.jpg']
  },
  {
    name: 'ceramic coffee mug',
    description: 'Microwave-safe ceramic mug with a clean matte finish.',
    price: 349,
    category: 'kitchen',
    images: ['mug-1.jpg']
  }
];

const connectDB = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error('MONGODB_URL is missing. Add it to your .env file before running the seed script.');
  }

  await mongoose.connect(process.env.MONGODB_URL);
  console.log('MongoDB connected for seeding');
};

const seedDatabase = async () => {
  await connectDB();

  const seedEmails = users.map((user) => user.email);
  const seedProductNames = products.map((product) => product.name);

  await UserModel.deleteMany({ email: { $in: seedEmails } });
  await Product.deleteMany({ name: { $in: seedProductNames } });

  const createdUsers = await UserModel.create(users);

  const productsWithRatings = products.map((product, index) => {
    const firstUser = createdUsers[index % createdUsers.length];
    const secondUser = createdUsers[(index + 1) % createdUsers.length];
    const firstRating = 4 + (index % 2);
    const secondRating = 3 + (index % 3);
    const ratings = [
      {
        userId: firstUser._id,
        rating: firstRating,
        comment: 'Good quality product for the price.'
      },
      {
        userId: secondUser._id,
        rating: secondRating,
        comment: 'Useful item and delivery experience was smooth.'
      }
    ];

    return {
      ...product,
      ratings,
      averageRating: ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length
    };
  });

  const createdProducts = await Product.insertMany(productsWithRatings);

  console.log(`Seeded ${createdUsers.length} users`);
  console.log(`Seeded ${createdProducts.length} products`);
};

seedDatabase()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
