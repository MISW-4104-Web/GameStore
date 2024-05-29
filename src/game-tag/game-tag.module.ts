import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from '../game/game.entity';
import { TagEntity } from '../tag/tag.entity';
import { GameTagService } from './game-tag.service';
import { GameTagController } from './game-tag.controller';

@Module({
    imports: [TypeOrmModule.forFeature([GameEntity, TagEntity])],
    providers: [GameTagService],
    controllers: [GameTagController],
})
export class GameTagModule {}
