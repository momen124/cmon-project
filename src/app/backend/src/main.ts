import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BootstrapConsole } from 'nestjs-console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

// Run CLI commands if executed via `nest`
if (process.argv.includes('seed') || process.argv.includes('clear')) {
  const bootstrapConsole = new BootstrapConsole({
    module: AppModule,
    useDecorators: true,
  });
  bootstrapConsole.init().catch((err) => {
    console.error('Console application failed to start:', err);
    process.exit(1);
  });
} else {
  // Run HTTP server for `npm run start:dev`
  bootstrap().catch((err) => {
    console.error('Application failed to start:', err);
    process.exit(1);
  });
}