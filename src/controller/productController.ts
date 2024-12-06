// controller/productController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Add a new product
export const addProduct = async (req: Request, res: Response) => {
  const { name, description, price, imageUrl } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add product' });
  }
};

// Update a product by ID
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, imageUrl } = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price,
        imageUrl,
      },
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// Delete a product by ID
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};
