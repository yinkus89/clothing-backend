"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const client_1 = require("@prisma/client");
// Initialize dotenv
dotenv_1.default.config();
// Initialize Prisma Client
const prisma = new client_1.PrismaClient();
// Check if necessary environment variables are set
if (!process.env.JWT_SECRET) {
    console.error('Error: JWT_SECRET environment variable is not set.');
    process.exit(1); // Stop the app if JWT_SECRET is missing
}
const app = (0, express_1.default)();
exports.app = app;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the E-commerce API!');
});
// Example User Registration Route
app.post('/api/auth/register', async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error, please try again later' });
    }
});
// Test Prisma Client
app.get('/test', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users from the database' });
    }
});
// Global Error Handler
app.use((err, req, res, next) => {
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
exports.port = port;
exports.default = app;
