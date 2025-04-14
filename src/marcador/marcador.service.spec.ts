import { Test, TestingModule } from '@nestjs/testing';
import { MarcadorService } from './marcador.service';

describe('MarcadorService', () => {
  let service: MarcadorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarcadorService],
    }).compile();

    service = module.get<MarcadorService>(MarcadorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
