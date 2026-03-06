import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyController } from './technology.controller';
import { TechnologyService } from './technology.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Response } from 'express';

describe('TechnologyController', () => {
  let controller: TechnologyController;
  let technologyService: jest.Mocked<Partial<TechnologyService>>;

  const mockTechnology = {
    _id: '60d5ecb3e39542001f3f4c6a',
    name: 'TypeScript',
    published: true,
    category: 'LANGUAGES',
    ring: 'ADOPT',
    description: 'A typed superset of JavaScript.',
    classificationDescription: 'Industry standard.',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    technologyService = {
      findTechnologies: jest.fn(),
      getTechnologyById: jest.fn(),
      createTechnology: jest.fn(),
      updateMasterData: jest.fn(),
      deleteTechnology: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnologyController],
      providers: [
        {
          provide: TechnologyService,
          useValue: technologyService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TechnologyController>(TechnologyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findTechnologies', () => {
    it('should return technologies from service', async () => {
      technologyService.findTechnologies.mockResolvedValue(
        Promise.resolve([mockTechnology as any]),
      );

      const result = await controller.findTechnologies({} as any);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('TypeScript');
      expect(technologyService.findTechnologies).toHaveBeenCalled();
    });

    it('should filter by published when query param is provided', async () => {
      technologyService.findTechnologies.mockResolvedValue(
        Promise.resolve([mockTechnology as any]),
      );

      await controller.findTechnologies({} as any, { published: true });

      expect(technologyService.findTechnologies).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        true,
        undefined,
        undefined,
      );
    });
  });

  describe('getTechnologyById', () => {
    it('should return technology if found', async () => {
      technologyService.getTechnologyById.mockResolvedValue(
        Promise.resolve(mockTechnology as any),
      );
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.getTechnologyById('123', res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 404 if not found', async () => {
      technologyService.getTechnologyById.mockResolvedValue(null);
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.getTechnologyById('123', res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
