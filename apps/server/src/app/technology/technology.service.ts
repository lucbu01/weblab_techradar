import { Injectable } from '@nestjs/common';
import { Technology, TechnologyDocument } from './technology.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
}
