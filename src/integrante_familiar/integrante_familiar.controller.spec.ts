import { Test, TestingModule } from '@nestjs/testing';
import { IntegranteFamiliarController } from './integrante_familiar.controller';
import { IntegranteFamiliarService } from './integrante_familiar.service';

describe('IntegranteFamiliarController', () => {
  let controller: IntegranteFamiliarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntegranteFamiliarController],
      providers: [IntegranteFamiliarService],
    }).compile();

    controller = module.get<IntegranteFamiliarController>(IntegranteFamiliarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
