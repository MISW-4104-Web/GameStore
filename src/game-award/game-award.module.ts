import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwardEntity } from '../award/award.entity';
import { GameEntity } from '../game/game.entity';
import { GameAwardService } from './game-award.service';
import { GameAwardController } from './game-award.controller';

@Module({
    imports: [TypeOrmModule.forFeature([GameEntity, AwardEntity])],
    providers: [GameAwardService],
    controllers: [GameAwardController],
})
export class GameAwardModule {}
