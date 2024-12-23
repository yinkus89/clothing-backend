"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controller/orderController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authMiddleware, orderController_1.getOrders);
router.post('/', authMiddleware_1.authMiddleware, orderController_1.createOrder);
router.get('/:id', authMiddleware_1.authMiddleware, orderController_1.getOrderById);
exports.default = router;
