"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};
exports.getProducts = getProducts;
// Add a new product
const addProduct = async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add product' });
    }
};
exports.addProduct = addProduct;
// Update a product by ID
const updateProduct = async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update product' });
    }
};
exports.updateProduct = updateProduct;
// Delete a product by ID
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};
exports.deleteProduct = deleteProduct;
