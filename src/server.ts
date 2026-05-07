import { buildApp } from './app.js';
import 'dotenv/config';

const start = async () => {
  const app = await buildApp();

  try {
    const port = parseInt(process.env.PORT || '5001', 10);
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    console.log(`🚀 Server listening on http://${host}:${port}`);
    console.log(`📝 Documentation ready at http://${host}:${port}/docs`);

    // Graceful Shutdown Logic
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
        await app.close();
        console.log('✅ Server closed. Goodbye!');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
