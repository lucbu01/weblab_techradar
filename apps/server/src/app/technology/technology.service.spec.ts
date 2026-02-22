import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyService } from './technology.service';
import { getModelToken } from '@nestjs/mongoose';
import { Technology } from './technology.schema';
import { NotFoundException } from '@nestjs/common';

describe('TechnologyService', () => {
  let service: TechnologyService;
  let model: any;

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
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechnologyService,
        {
          provide: getModelToken(Technology.name),
          useValue: jest.fn().mockImplementation(() => mockTechnology),
        },
      ],
    }).compile();

    service = module.get<TechnologyService>(TechnologyService);
    model = module.get(getModelToken(Technology.name));

    // Add static methods to mock model
    model.find = jest.fn().mockReturnThis();
    model.findById = jest.fn().mockReturnThis();
    model.findByIdAndUpdate = jest.fn().mockReturnThis();
    model.findByIdAndDelete = jest.fn().mockReturnThis();
    model.exec = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findTechnologies', () => {
    it('should return all technologies', async () => {
      model.exec.mockResolvedValue([mockTechnology]);
      const result = await service.findTechnologies();
      expect(result).toEqual([mockTechnology]);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findTechnologiesByPublished', () => {
    it('should return only published technologies', async () => {
      model.exec.mockResolvedValue([mockTechnology]);
      const result = await service.findTechnologiesByPublished(true);
      expect(result).toEqual([mockTechnology]);
      expect(model.find).toHaveBeenCalledWith({ published: true });
    });
  });

  describe('getTechnologyById', () => {
    it('should return a technology by id', async () => {
      model.exec.mockResolvedValue(mockTechnology);
      const result = await service.getTechnologyById('123');
      expect(result).toEqual(mockTechnology);
      expect(model.findById).toHaveBeenCalledWith('123');
    });
  });

  describe('createTechnology', () => {
    it('should create a new technology', async () => {
      const dto: any = {
        name: 'New Tech',
        published: false,
        category: 'TOOLS',
        description: 'Description',
      };

      mockTechnology.save.mockResolvedValue({ ...dto, _id: 'new-id' });

      const result = await service.createTechnology(dto);

      expect(result._id).toBe('new-id');
      expect(mockTechnology.save).toHaveBeenCalled();
    });
  });

  describe('updateMasterData', () => {
    it('should update and return the technology', async () => {
      model.exec.mockResolvedValue(mockTechnology);
      const dto = {
        name: 'Updated',
        category: 'PLATFORMS' as any,
        description: 'New desc',
      };

      const result = await service.updateMasterData('123', dto);

      expect(result).toEqual(mockTechnology);
      expect(model.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should throw NotFoundException if technology not found', async () => {
      model.exec.mockResolvedValue(null);
      await expect(service.updateMasterData('123', {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteTechnology', () => {
    it('should delete the technology', async () => {
      model.exec.mockResolvedValue(mockTechnology);
      await service.deleteTechnology('123');
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException if technology not found', async () => {
      model.exec.mockResolvedValue(null);
      await expect(service.deleteTechnology('123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
