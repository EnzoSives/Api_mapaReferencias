import { Test, TestingModule } from '@nestjs/testing';
import { MarcadorSegService } from './marcador-seg.service';

describe('MarcadorSegService', () => {
  let service: MarcadorSegService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarcadorSegService],
    }).compile();

    service = module.get<MarcadorSegService>(MarcadorSegService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
