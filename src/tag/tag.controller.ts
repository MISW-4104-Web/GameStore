import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { TagService } from './tag.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { TagDto } from './tag.dto';
import { TagEntity } from './tag.entity';

@Controller('tags')
@UseInterceptors(BusinessErrorsInterceptor)
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Get()
    async findAll() {
        return await this.tagService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.tagService.findOne(id);
    }

    @Post()
    async create(@Body() tagDto: TagDto) {
        const tag: TagEntity = plainToInstance(TagEntity, tagDto);
        return await this.tagService.create(tag);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() tagDto: TagDto) {
        const tag: TagEntity = plainToInstance(TagEntity, tagDto);
        return await this.tagService.update(id, tag);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.tagService.delete(id);
    }
}
