// import { PrismaClient } from '@prisma/client';

// export const prisma = new PrismaClient();


// prismaClient.ts
import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma =
    global.prisma ||
    new PrismaClient({
        log: ['query'],
        // @ts-ignore
        __internal: { usePreparedStatements: false }, // avoids pooler prepared statement errors
    });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;