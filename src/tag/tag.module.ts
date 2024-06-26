import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';

@Module({
    imports: [TypeOrmModule.forFeature([TagEntity])],
    providers: [TagService],
    controllers: [TagController],
})
export class TagModule {}
