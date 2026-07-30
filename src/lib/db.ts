// Prisma Client singleton — avoids connection-exhaustion during Next.js dev HMR.
// Prisma 6 reads DATABASE_URL from schema.prisma's env("DATABASE_URL").
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  __prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma;
}
