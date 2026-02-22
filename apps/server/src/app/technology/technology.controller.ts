import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { Technology } from '@techradar/libs';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../auth/auth.decorator';
import { TechnologyDto } from './dto/technology.dto';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { ParseObjectIdPipe } from './parse-objectid.pipe';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { UpsertTechnologyClassificationDto } from './dto/upsert-technology-classification.dto';
import { PutTechnologyPublicationDto } from './dto/put-technology-publication.dto';
import { TechnologyDocument } from './technology.schema';

@ApiBearerAuth('keycloak')
@ApiTags('technologies')
@Controller('technologies')
export class TechnologyController {
  constructor(private technologyService: TechnologyService) {}

  @Get()
  @Auth('CTO', 'TECHLEAD', 'EMPLOYEE')
  @ApiOperation({
    summary: 'Find technologies',
    description: 'Roles: `CTO`, `TECHLEAD`, `EMPLOYEE`',
  })
  @ApiQuery({
    name: 'published',
    required: false,
    type: Boolean,
    description: 'Filter by published state',
  })
  @ApiOkResponse({
    description: 'List of technologies',
    type: TechnologyDto,
    isArray: true,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findTechnologies(
    @Query('published') published?: boolean,
  ): Promise<Technology[]> {
    const technologies =
      published === undefined
        ? await this.technologyService.findTechnologies()
        : await this.technologyService.findTechnologiesByPublished(published);
    return technologies.map((t) => this.map(t));
  }

  @Get('/:id')
  @Auth('CTO', 'TECHLEAD', 'EMPLOYEE')
  @ApiOperation({
    summary: 'Get technology by id',
    description: 'Roles: `CTO`, `TECHLEAD`, `EMPLOYEE`',
  })
  @ApiOkResponse({
    description: 'Technology',
    type: TechnologyDto,
    isArray: false,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTechnologyById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: Response,
  ) {
    const technology = await this.technologyService.getTechnologyById(id);
    if (!technology) {
      res.status(404).send();
    } else {
      res.status(200).json(this.map(technology)).send();
    }
  }

  @Post()
  @Auth('CTO', 'TECHLEAD')
  @ApiOperation({
    summary: 'Create technology',
    description: 'Roles: `CTO`, `TECHLEAD`',
  })
  @ApiBody({ type: CreateTechnologyDto })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createTechnology(
    @Body() technology: CreateTechnologyDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const created = await this.technologyService.createTechnology({
      name: technology.name,
      createdAt: undefined,
      publishedAt: undefined,
      updatedAt: undefined,
      published: technology.published,
      category: technology.category,
      ring: technology.ring,
      description: technology.description,
      classificationDescription: technology.classificationDescription,
    });
    res
      .status(201)
      .location(`${req.url}/${created._id.toString()}`)
      .json(this.map(created))
      .send();
  }

  @Patch('/:id')
  @Auth('CTO', 'TECHLEAD')
  @ApiOperation({
    summary: 'Update technology master data',
    description: 'Roles: `CTO`, `TECHLEAD`',
  })
  @ApiBody({ type: UpdateTechnologyDto })
  @ApiOkResponse({ description: 'Updated technology', type: TechnologyDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateTechnology(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateTechnologyDto,
  ) {
    const updated = await this.technologyService.updateMasterData(id, dto);
    return this.map(updated);
  }

  @Put('/:id/classification')
  @Auth('CTO', 'TECHLEAD')
  @ApiOperation({
    summary: 'Upsert technology classification',
    description: 'Roles: `CTO`, `TECHLEAD`',
  })
  @ApiBody({ type: UpsertTechnologyClassificationDto })
  @ApiOkResponse({ description: 'Updated technology', type: TechnologyDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async putClassification(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpsertTechnologyClassificationDto,
  ) {
    const updated = await this.technologyService.upsertClassification(id, dto);
    return this.map(updated);
  }

  @Put('/:id/publication')
  @Auth('CTO', 'TECHLEAD')
  @ApiOperation({
    summary: 'Publish technology',
    description: 'Roles: `CTO`, `TECHLEAD`',
  })
  @ApiBody({ type: PutTechnologyPublicationDto })
  @ApiOkResponse({ description: 'Published technology', type: TechnologyDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async putPublication(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: PutTechnologyPublicationDto,
  ) {
    const updated = await this.technologyService.putPublication(id, dto);
    return this.map(updated);
  }

  @Delete('/:id')
  @HttpCode(204)
  @Auth('CTO', 'TECHLEAD')
  @ApiOperation({
    summary: 'Delete technology',
    description: 'Roles: `CTO`, `TECHLEAD`',
  })
  @ApiResponse({ status: 204, description: 'Deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteTechnology(@Param('id', ParseObjectIdPipe) id: string) {
    await this.technologyService.deleteTechnology(id);
  }

  private map(technology: TechnologyDocument): TechnologyDto {
    return {
      id: technology._id.toString(),
      name: technology.name,
      published: technology.published,
      createdAt: technology.createdAt.toISOString(),
      publishedAt: technology.publishedAt?.toISOString(),
      updatedAt: technology.updatedAt.toISOString(),
      category: technology.category,
      ring: technology.ring,
      description: technology.description,
      classificationDescription: technology.classificationDescription,
    };
  }
}
