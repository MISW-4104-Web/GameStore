import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevelopmentCompanyEntity } from './development-company.entity';
import { DevelopmentCompanyService } from './development-company.service';

@Module({
    imports: [TypeOrmModule.forFeature([DevelopmentCompanyEntity])],
    providers: [DevelopmentCompanyService],
})
export class DevelopmentCompanyModule {}
