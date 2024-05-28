import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './review.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { GameEntity } from '../game/game.entity';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(ReviewEntity)
        private readonly reviewRepository: Repository<ReviewEntity>,
        @InjectRepository(GameEntity)
        private readonly gameRepository: Repository<GameEntity>
    ) {}
        
    async findAll(): Promise<ReviewEntity[]> {
        return await this.reviewRepository.find({
            relations: {
                game: {
                    minimumRequirements: true,
                    developmentCompany: true
                }
            }
        });
    }

    async findOne(id: string): Promise<ReviewEntity> {
        const review = await this.reviewRepository.findOne({
            where: {id},
            relations: {
                game: {
                    minimumRequirements: true,
                    developmentCompany: true
                }
            }
        });

        if (!review) {
            throw new BusinessLogicException("The review with the given id was not found", BusinessError.NOT_FOUND);
        }

        return review;
    }

    async create(review: ReviewEntity): Promise<ReviewEntity> {

        const game: GameEntity = await this.validateRelations(review);

        review.game = game;

        return await this.reviewRepository.save(review);
    }

    async update(id: string, review: ReviewEntity): Promise<ReviewEntity> {
        const persistedReview = await this.reviewRepository.findOne({
            where: {id}
        });

        if (!persistedReview) {
            throw new BusinessLogicException("The review with the given id was not found", BusinessError.NOT_FOUND);
        }

        const game: GameEntity = await this.validateRelations(review);

        review.game = game;

        return await this.reviewRepository.save({...persistedReview, ...review});
    }

    async delete(id: string) {
        const persistedReview = await this.reviewRepository.findOne({
            where: {id}
        });

        if(!persistedReview) {
            throw new BusinessLogicException("The review with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.reviewRepository.remove(persistedReview);
    }   

    validateRelations = async (review: ReviewEntity) => {
        if (!review.game || !review.game.id) {
            throw new BusinessLogicException("The review needs an game to be created or updated", BusinessError.BAD_REQUEST);
        }

        const game: GameEntity =  await this.gameRepository.findOne({
            where: {id: review.game.id}
        });

        if (!game) {
            throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }

        return game;
    }

}
