import http from 'http';
import app from './app';
import { prisma } from './lib/prisma';

const port = Number(process.env.PORT || 3000);
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});

const gracefulShutdown = async () => {
  console.log('⚠️  Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);