"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const clients_1 = __importDefault(require("../prisma/clients")); // Correct import
// Register a new user
const register = async (req, res) => {
    const { email, password, username } = req.body;
    // Check if the email or username already exists in the database
    const existingUser = await clients_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
    }
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create a new user
        const user = await clients_1.default.user.create({
            data: { email, password: hashedPassword, username },
        });
        res.status(201).json({ message: "User registered successfully", user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error during registration" });
    }
};
exports.register = register;
// Login a user
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await clients_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Compare hashed passwords
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token, user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error during login" });
    }
};
exports.login = login;
