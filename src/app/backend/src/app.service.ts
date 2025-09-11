import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}  // Empty constructor; no self-injection

  getHello(): string {
    return 'Hello World!';
  }
}