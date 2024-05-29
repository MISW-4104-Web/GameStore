import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { DevelopmentCompanyService } from './development-company.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { DevelopmentCompanyDto } from './development-company.dto';
import { plainToInstance } from 'class-transformer';
import { DevelopmentCompanyEntity } from './development-company.entity';

@Controller('developmentCompanies')
@UseInterceptors(BusinessErrorsInterceptor)
export class DevelopmentCompanyController {
    constructor(private readonly developmentCompanyService: DevelopmentCompanyService) {}

    @Get()
    async findAll() {
        return await this.developmentCompanyService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.developmentCompanyService.findOne(id);
    }

    @Post()
    async create(@Body() developmentCompanyDto: DevelopmentCompanyDto) {
        const developmentCompany: DevelopmentCompanyEntity = plainToInstance(DevelopmentCompanyEntity, developmentCompanyDto);
        return await this.developmentCompanyService.create(developmentCompany);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() developmentCompanyDto: DevelopmentCompanyDto) {
        const developmentCompany: DevelopmentCompanyEntity = plainToInstance(DevelopmentCompanyEntity, developmentCompanyDto);
        return await this.developmentCompanyService.update(id, developmentCompany);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.developmentCompanyService.delete(id);
    }
}
