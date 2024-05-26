import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './review.entity';
import { ReviewService } from './review.service';

@Module({
    imports: [TypeOrmModule.forFeature([ReviewEntity])],
    providers: [ReviewService],
})
export class ReviewModule {}
