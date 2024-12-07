import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: 'hashedpassword',
      username: 'user123',
    },
  });

  const product = await prisma.product.create({
    data: {
      name: 'Product 1',
      description: 'This is a product.',
      price: 29.99,
      imageUrl: 'http://example.com/image.jpg',
    },
  });

  await prisma.order.create({
    data: {
      userId: user.id,
      status: 'pending',
      total: 29.99,
      items: {
        create: [
          {
            productId: product.id,
            quantity: 1,
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
