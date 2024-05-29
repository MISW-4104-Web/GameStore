import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevelopmentCompanyEntity } from './development-company.entity';
import { DevelopmentCompanyService } from './development-company.service';
import { DevelopmentCompanyController } from './development-company.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DevelopmentCompanyEntity])],
    providers: [DevelopmentCompanyService],
    controllers: [DevelopmentCompanyController],
})
export class DevelopmentCompanyModule {}
