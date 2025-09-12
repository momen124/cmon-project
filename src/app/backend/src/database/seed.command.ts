import { Command, Console } from 'nestjs-console';
import { SeederService } from './seeder';

@Console()
export class SeedCommand {
  constructor(private readonly seederService: SeederService) {}

  @Command({
    command: 'seed',
    description: 'Seed the database with initial data',
  })
  async seed() {
    try {
      await this.seederService.seed();
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
      await this.seederService.clear();
      console.log('Database cleared!');
    } catch (error) {
      console.error('Clearing failed:', error);
      process.exit(1);
    }
  }
}