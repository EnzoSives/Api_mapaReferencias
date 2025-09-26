import { Test, TestingModule } from '@nestjs/testing';
import { MarcadorSegController } from './marcador-seg.controller';
import { MarcadorSegService } from './marcador-seg.service';

describe('MarcadorSegController', () => {
  let controller: MarcadorSegController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarcadorSegController],
      providers: [MarcadorSegService],
    }).compile();

    controller = module.get<MarcadorSegController>(MarcadorSegController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
