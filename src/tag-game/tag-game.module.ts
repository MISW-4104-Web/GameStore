import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from '../game/game.entity';
import { TagEntity } from '../tag/tag.entity';
import { TagGameService } from './tag-game.service';
import { TagGameController } from './tag-game.controller';

@Module({
    imports: [TypeOrmModule.forFeature([TagEntity, GameEntity])],
    providers: [TagGameService],
    controllers: [TagGameController],
})
export class TagGameModule {}
