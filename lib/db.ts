import { PrismaClient } from "@prisma/client";

declare global {
    let prisma: PrismaClient | undefined; // Use 'let' instead of 'var'
}

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;