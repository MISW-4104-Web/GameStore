import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { MinimumSpecService } from './minimum-spec.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { MinimumSpecDto } from './minimum-spec.dto';
import { plainToInstance } from 'class-transformer';
import { MinimumSpecEntity } from './minimum-spec.entity';

@Controller('minimumSpecs')
@UseInterceptors(BusinessErrorsInterceptor)
export class MinimumSpecController {
    constructor(private readonly minimumSpecService: MinimumSpecService) {}

    @Get()
    async findAll() {
        return await this.minimumSpecService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.minimumSpecService.findOne(id);
    }

    @Post()
    async create(@Body() minimumSpecDto: MinimumSpecDto) {
        const minimumSpec: MinimumSpecEntity = plainToInstance(MinimumSpecEntity, minimumSpecDto);
        return await this.minimumSpecService.create(minimumSpec);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() minimumSpecDto: MinimumSpecDto) {
        const minimumSpec: MinimumSpecEntity = plainToInstance(MinimumSpecEntity, minimumSpecDto);
        return await this.minimumSpecService.update(id, minimumSpec);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.minimumSpecService.delete(id);
    }
}
