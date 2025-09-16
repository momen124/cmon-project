import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BootstrapConsole } from 'nestjs-console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

// Run CLI commands
if (process.argv.includes('--seed') || process.argv.includes('--clear')) {
  const consoleBootstrap = new BootstrapConsole({
    module: AppModule,
    useDecorators: true,
  });
  consoleBootstrap.init().then(async (app) => {
    try {
      await app.init();
      console.log('CLI application initialized');
      await consoleBootstrap.boot(process.argv);
      console.log('CLI command executed successfully');
      await app.close();
      process.exit(0);
    } catch (error) {
      console.error('CLI bootstrap failed:', error);
      process.exit(1);
    }
  }).catch((error) => {
    console.error('CLI initialization failed:', error);
    process.exit(1);
  });
} else {
  // Run HTTP server
  bootstrap().catch((err) => {
    console.error('Application failed to start:', err);
    process.exit(1);
  });
}