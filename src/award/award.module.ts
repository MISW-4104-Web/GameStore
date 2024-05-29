import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwardEntity } from './award.entity';
import { AwardService } from './award.service';
import { AwardController } from './award.controller';

@Module({
    imports: [TypeOrmModule.forFeature([AwardEntity])],
    providers: [AwardService],
    controllers: [AwardController],
})
export class AwardModule {}
