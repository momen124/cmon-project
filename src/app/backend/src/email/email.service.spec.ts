import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { getQueueToken } from '@nestjs/bull';

describe('EmailService', () => {
  let service: EmailService;

  const mockEmailQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: getQueueToken('email'),
          useValue: mockEmailQueue,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
