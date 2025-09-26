import { Test, TestingModule } from '@nestjs/testing';
import { DelitoService } from './delito.service';

describe('DelitoService', () => {
  let service: DelitoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DelitoService],
    }).compile();

    service = module.get<DelitoService>(DelitoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
