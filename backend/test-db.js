const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Testing database connection...');
    try {
        await prisma.$connect();
        console.log('Successfully connected to the database!');

        // Try a simple query
        const result = await prisma.$queryRaw`SELECT 1 as result`;
        console.log('Query result:', result);

        console.log('Connection test passed.');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
