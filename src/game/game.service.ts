import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from './game.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameEntity)
        private readonly gameRepository: Repository<GameEntity>
    ) {}

    
    async findAll(): Promise<GameEntity[]> {
        return await this.gameRepository.find({
            relations: {
                awards: true,
                developmentCompany: true,
                minimumRequirements: true,
                reviews: true,
                tags: true
            }
        });
    }

    async findOne(id: string): Promise<GameEntity> {
        const game = await this.gameRepository.findOne({
            where: {id},
            relations: {
                awards: true,
                developmentCompany: true,
                minimumRequirements: true,
                reviews: true,
                tags: true
            }
        });

        if (!game) {
            throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }

        return game;
    }

    async create(game: GameEntity): Promise<GameEntity> {
        return await this.gameRepository.save(game);
    }

    async update(id: string, game: GameEntity): Promise<GameEntity> {
        const persistedGame = await this.gameRepository.findOne({
            where: {id}
        });

        if (!persistedGame) {
            throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }

        return await this.gameRepository.save({...persistedGame, ...game});
    }

    async delete(id: string) {
        const persistedGame = await this.gameRepository.findOne({
            where: {id}
        });

        if(!persistedGame) {
            throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.gameRepository.remove(persistedGame);
    }   

}
