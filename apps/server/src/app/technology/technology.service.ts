import { Injectable, NotFoundException } from '@nestjs/common';
import { Technology, TechnologyDocument } from './technology.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { UpsertTechnologyClassificationDto } from './dto/upsert-technology-classification.dto';
import { PutTechnologyPublicationDto } from './dto/put-technology-publication.dto';

@Injectable()
export class TechnologyService {
  constructor(
    @InjectModel(Technology.name) private technologyModel: Model<Technology>,
  ) {}

  async findTechnologiesByPublished(
    published: boolean,
  ): Promise<TechnologyDocument[]> {
    return this.technologyModel.find({ published }).exec();
  }

  async findTechnologies(): Promise<TechnologyDocument[]> {
    return this.technologyModel.find().exec();
  }

  async getTechnologyById(id: string): Promise<TechnologyDocument> {
    return this.technologyModel.findById(id).exec();
  }

  async createTechnology(technology: Technology): Promise<TechnologyDocument> {
    technology.createdAt = new Date();
    technology.updatedAt = new Date();
    if (technology.published) {
      technology.publishedAt = new Date();
    }
    const newTechnology = new this.technologyModel(technology);
    return newTechnology.save();
  }

  async updateMasterData(
    id: string,
    dto: UpdateTechnologyDto,
  ): Promise<TechnologyDocument> {
    const updated = await this.technologyModel
      .findByIdAndUpdate(id, {
        $set: {
          name: dto.name,
          category: dto.category,
          description: dto.description,
          updatedAt: new Date(),
        },
      })
      .exec();

    if (!updated) throw new NotFoundException('Technology not found');
    return updated;
  }

  async upsertClassification(
    id: string,
    dto: UpsertTechnologyClassificationDto,
  ): Promise<TechnologyDocument> {
    const updated = await this.technologyModel
      .findByIdAndUpdate(id, {
        $set: {
          ring: dto.ring,
          classificationDescription: dto.classificationDescription,
          updatedAt: new Date(),
        },
      })
      .exec();

    if (!updated) throw new NotFoundException('Technology not found');
    return updated;
  }

  async putPublication(
    id: string,
    dto: PutTechnologyPublicationDto,
  ): Promise<TechnologyDocument> {
    const now = new Date();

    const doc = await this.technologyModel.findById(id).exec();
    if (!doc) throw new NotFoundException('Technology not found');

    doc.published = true;
    doc.ring = dto.ring;
    doc.classificationDescription = dto.classificationDescription;
    doc.updatedAt = now;

    if (!doc.publishedAt) {
      doc.publishedAt = now;
    }

    return doc.save();
  }

  async deleteTechnology(id: string): Promise<void> {
    const deleted = await this.technologyModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Technology not found');
  }
}
