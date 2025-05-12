import { Test, TestingModule } from '@nestjs/testing';
import { IntegranteFamiliarService } from './integrante_familiar.service';

describe('IntegranteFamiliarService', () => {
  let service: IntegranteFamiliarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntegranteFamiliarService],
    }).compile();

    service = module.get<IntegranteFamiliarService>(IntegranteFamiliarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
