import { PrismaClient } from '../generated/prisma';

// Add prisma to the globalThis object so that it can be accessed across hot module reloads
// in development environments and across serverless function invocations.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? (() => {
  console.log('Creating new PrismaClient instance'); // Sanity check
  const client = new PrismaClient();
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
  return client;
})();
