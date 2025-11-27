import { PrismaClient } from '../generated/prisma';

// Define a global type for the Prisma client to prevent multiple instances
// in development environments (due to hot module reloading) and serverless functions.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Initialize the Prisma client.
// In development, we store it on the global object to reuse it across hot reloads.
// In production and test environments, a new instance is created as needed.
// biome-ignore suspicious/noRedeclare
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'], // Example: Log all queries to the console
  });

// If not in production, assign the Prisma client to the global object.
// This ensures that during development, the same client instance is reused
// across hot module reloads, preventing excessive database connections.
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Smoke-check to ensure the global Prisma client is correctly assigned and of the right type.
// This helps prevent accidental global pollution or incorrect assignments.
if (process.env.NODE_ENV === 'development') {
  if (global.prisma !== prisma) {
    console.warn('Prisma client in globalThis is not the expected instance.');
  }
}
