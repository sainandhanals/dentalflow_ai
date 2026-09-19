import app from './app';
import { config } from './config/env';
import { prisma } from './config/prisma';

const server = app.listen(config.port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║         DentalFlow AI - Full-Stack Express Server         ║
╠═══════════════════════════════════════════════════════════╣
║  • Port:        ${config.port}                                      ║
║  • Mode:        ${config.nodeEnv}                              ║
║  • Healthcheck: http://localhost:${config.port}/api/health           ║
║  • Database:    SQLite (${config.databaseUrl})                ║
║  • AI Engine:   Deterministic Dental Rule Engine (Live)   ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Database connection closed. Process terminated.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
