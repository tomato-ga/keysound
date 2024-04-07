// /Users/ore/Documents/GitHub/keysound/src/app/lib/prisma/index.ts

import { PrismaClient, Prisma } from '@prisma/client'

const prismaClientSingleton = () => {
	return new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { Prisma }
