import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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

@ApiBearerAuth('keycloak')
@ApiTags('technologies')
@Controller('technologies')
export class TechnologyController {
  constructor(private technologyService: TechnologyService) {}

  @Get()
  @Auth('CTO', 'TECHLEAD', 'EMPLOYEE')
  @ApiOperation({ summary: 'Find technologies' })
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
    return technologies.map((t) => ({
      id: t._id.toString(),
      name: t.name,
      published: t.published,
      createdAt: t.createdAt.toISOString(),
      publishedAt: t.publishedAt?.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      category: t.category,
      ring: t.ring,
      description: t.description,
      classificationDescription: t.classificationDescription,
    }));
  }

  @Get('/:id')
  @Auth('CTO', 'TECHLEAD', 'EMPLOYEE')
  @ApiOperation({ summary: 'Get technology' })
  @ApiOkResponse({
    description: 'Technology',
    type: TechnologyDto,
    isArray: false,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTechnologyById(@Param('id') id: string, @Res() res: Response) {
    const technology = await this.technologyService.getTechnologyById(id);
    if (!technology) {
      res.status(404).send();
    }
    res.status(200).json(technology);
  }

  @Post()
  @Auth('CTO', 'TECHLEAD')
  @ApiOperation({ summary: 'Create technology' })
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
      .location(`${req.headers.origin}${req.url}/${created._id.toString()}`)
      .send();
  }
}
