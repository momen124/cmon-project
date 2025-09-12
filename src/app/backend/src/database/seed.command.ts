import { Command, Console } from 'nestjs-console';
import { SeedService } from 'src/seed/seed.service';

@Console()
export class SeedCommand {
  constructor(private readonly seedService: SeedService) {}

  @Command({
    command: 'seed',
    description: 'Seed the database with initial data',
  })
  async seed() {
    try {
      await this.seedService.seed();
      console.log('Seeding completed!');
    } catch (error) {
      console.error('Seeding failed:', error);
      process.exit(1);
    }
  }

  @Command({
    command: 'clear',
    description: 'Clear all data from the database',
  })
  async clear() {
    try {
      await this.seedService.clear();
      console.log('Database cleared!');
    } catch (error) {
      console.error('Clearing failed:', error);
      process.exit(1);
    }
  }
}