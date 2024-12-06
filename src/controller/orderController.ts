import { Request, Response } from "express";
import prisma from "../../prisma/clients";

// Get all orders
export const getOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: { items: true, user: true },
  });
  res.json(orders);
};

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  const { userId, status, total, items } = req.body;

  const order = await prisma.order.create({
    data: {
      userId,
      status,
      total,
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
  });

  res.status(201).json(order);
};

// Get a specific order by ID
export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { items: true, user: true },
  });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
};
