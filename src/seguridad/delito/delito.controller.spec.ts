import { Test, TestingModule } from '@nestjs/testing';
import { DelitoController } from './delito.controller';
import { DelitoService } from './delito.service';

describe('DelitoController', () => {
  let controller: DelitoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DelitoController],
      providers: [DelitoService],
    }).compile();

    controller = module.get<DelitoController>(DelitoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
