import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ReviewService } from './review.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { ReviewDto } from './review.dto';
import { ReviewEntity } from './review.entity';

@Controller('reviews')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get()
    async findAll() {
        return await this.reviewService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.reviewService.findOne(id);
    }

    @Post()
    async create(@Body() reviewDto: ReviewDto) {
        const review: ReviewEntity = plainToInstance(ReviewEntity, reviewDto);
        return await this.reviewService.create(review);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() reviewDto: ReviewDto) {
        const review: ReviewEntity = plainToInstance(ReviewEntity, reviewDto);
        return await this.reviewService.update(id, review);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.reviewService.delete(id);
    }

}
