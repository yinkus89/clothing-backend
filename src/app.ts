import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import { PrismaClient } from '@prisma/client';

// Initialize dotenv
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

// Check if necessary environment variables are set
if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET environment variable is not set.');
  process.exit(1); // Stop the app if JWT_SECRET is missing
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root Route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the E-commerce API!');
});

// Example User Registration Route
app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  // Validate input
  if (!email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password, // In a real-world app, you should hash the password!
      },
    });

    // Send response with the newly created user
    return res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
});

// Test Prisma Client
app.get('/test', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users from the database' });
  }
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// Gracefully disconnect Prisma on shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  console.log('Prisma client disconnected');
});
// Export app and port
const port = process.env.PORT || 5000;
export { app, port };

export default app;