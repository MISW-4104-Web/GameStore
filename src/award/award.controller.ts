import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AwardService } from './award.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AwardDto } from './award.dto';
import { AwardEntity } from './award.entity';
import { plainToInstance } from 'class-transformer';

@Controller('awards')
@UseInterceptors(BusinessErrorsInterceptor)
export class AwardController {
    constructor(private readonly awardService: AwardService) {}

    @Get()
    async findAll() {
        return await this.awardService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.awardService.findOne(id);
    }

    @Post()
    async create(@Body() awardDto: AwardDto) {
        const award: AwardEntity = plainToInstance(AwardEntity, awardDto);
        return await this.awardService.create(award);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() awardDto: AwardDto) {
        const award: AwardEntity = plainToInstance(AwardEntity, awardDto);
        return await this.awardService.update(id, award);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.awardService.delete(id);
    }

}
