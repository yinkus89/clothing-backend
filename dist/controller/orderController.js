"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.createOrder = exports.getOrders = void 0;
const clients_1 = __importDefault(require("../../prisma/clients"));
// Get all orders
const getOrders = async (req, res) => {
    const orders = await clients_1.default.order.findMany({
        include: { items: true, user: true },
    });
    res.json(orders);
};
exports.getOrders = getOrders;
// Create a new order
const createOrder = async (req, res) => {
    const { userId, status, total, items } = req.body;
    const order = await clients_1.default.order.create({
        data: {
            userId,
            status,
            total,
            items: {
                create: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            },
        },
    });
    res.status(201).json(order);
};
exports.createOrder = createOrder;
// Get a specific order by ID
const getOrderById = async (req, res) => {
    const { id } = req.params;
    const order = await clients_1.default.order.findUnique({
        where: { id: Number(id) },
        include: { items: true, user: true },
    });
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
};
exports.getOrderById = getOrderById;
