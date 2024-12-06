"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Rate limiting
const authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});
router.use(authRateLimiter);
// Register a new user
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    (0, express_validator_1.body)('username').isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters long'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .matches(/\d/).withMessage('Password must be at least 8 characters and include a number'),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, username, password } = req.body;
    try {
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        // Hash password
        const SALT_ROUNDS = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
        // Create user
        const newUser = await prisma.user.create({
            data: { email, username, password: hashedPassword },
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user: { id: newUser.id, email: newUser.email, username: newUser.username } },
        });
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});
// Login a user
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { token },
        });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});
exports.default = router;
