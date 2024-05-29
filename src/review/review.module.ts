import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './review.entity';
import { ReviewService } from './review.service';
import { GameEntity } from '../game/game.entity';
import { ReviewController } from './review.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ReviewEntity, GameEntity])],
    providers: [ReviewService],
    controllers: [ReviewController],
})
export class ReviewModule {}
