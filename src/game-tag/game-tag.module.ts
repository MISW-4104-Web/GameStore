import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from '../game/game.entity';
import { TagEntity } from '../tag/tag.entity';
import { GameTagService } from './game-tag.service';

@Module({
    imports: [TypeOrmModule.forFeature([GameEntity, TagEntity])],
    providers: [GameTagService],
})
export class GameTagModule {}
