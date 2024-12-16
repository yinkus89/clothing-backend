import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Example of querying a model (optional for testing)
async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Export the prisma instance for use in other files
export { prisma };
