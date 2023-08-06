import { Test, TestingModule } from '@nestjs/testing';
import { BikeController } from './bike.controller';
import { BikeService } from './bike.service';

describe('BikeController', () => {
  let controller: BikeController;
  const bikeServiceMock = {
    fetchBikeDataFromApi: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BikeController],
      providers: [
        {
          provide: BikeService,
          useValue: bikeServiceMock
        }
      ]
    }).compile();

    controller = module.get<BikeController>(BikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
