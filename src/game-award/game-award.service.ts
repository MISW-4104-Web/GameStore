import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from '../game/game.entity';
import { Repository } from 'typeorm';
import { AwardEntity } from '../award/award.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class GameAwardService {
    constructor(
        @InjectRepository(GameEntity)
        private readonly gameRepository: Repository<GameEntity>,
        @InjectRepository(AwardEntity)
        private readonly awardRepository: Repository<AwardEntity>
    ) {}


    async addAwardToGame(idGame: string, idAward: string): Promise<GameEntity> {

        const award: AwardEntity = await this.awardRepository.findOne({ where: {id: idAward} });
        const game: GameEntity = await this.gameRepository.findOne(
            { 
                where: {id: idGame},
                relations: {
                    minimumRequirements: true,
                    developmentCompany: true,
                    awards: true,
                    reviews: true,
                    tags: true,
                }
            }
        );

        if (!award) {
            throw new BusinessLogicException("The award with the given id was not found", BusinessError.NOT_FOUND);
        }

        if (!game) {
            throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND)
        }

        const awardSearched = game.awards.find((awardGame) => awardGame.id === award.id );

        if (awardSearched) {
            throw new BusinessLogicException("The award is already associated with this game", BusinessError.PRECONDITION_FAILED);
        }

        game.awards = [...game.awards, award];

        return await this.gameRepository.save(game);

    }

    async findAwardsByGameId(gameId: string): Promise<AwardEntity[]> {
        const game: GameEntity = await this.gameRepository.findOne({where: {id: gameId}, relations: { awards: true }});
        if (!game) {
          throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND)
        }
        return game.awards;
    }

    async findAwardByGameIdAwardId(gameId: string, awardId: string): Promise<AwardEntity> {
        const award: AwardEntity = await this.awardRepository.findOne({where: {id: awardId}});
        if (!award) {
          throw new BusinessLogicException("The award with the given id was not found", BusinessError.NOT_FOUND);
        }
        const game: GameEntity = await this.gameRepository.findOne({where: {id: gameId}, relations: { awards: true }}); 
        if (!game) {
          throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }
        const gameAward: AwardEntity = game.awards.find(e => e.id === award.id);
    
        if (!gameAward){
          throw new BusinessLogicException("The award with the given id is not associated to the game", BusinessError.PRECONDITION_FAILED);
        }
        return gameAward;
    }

    async updateAwardsFromGame(gameId: string, awards: AwardEntity[]): Promise<GameEntity> {
        const game: GameEntity = await this.gameRepository.findOne({where: {id: gameId}, relations: { awards: true }});
    
        if (!game){
          throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }
        for (let i = 0; i < awards.length; i++) {
          const award: AwardEntity = await this.awardRepository.findOne({where: {id: awards[i].id}});
          if (!award)
            throw new BusinessLogicException("The award with the given id was not found", BusinessError.NOT_FOUND);
        }
    
        game.awards = awards;
        return await this.awardRepository.save(game);
      }

    async deleteAwardFromGame(awardId: string, gameId: string){
        const award: AwardEntity = await this.awardRepository.findOne({ where: { id: awardId } });
        if (!award) {
            throw new BusinessLogicException("The award with the given id was not found", BusinessError.NOT_FOUND);
        }
        const game: GameEntity = await this.gameRepository.findOne({ where: { id: gameId }, relations: { awards: true }});
        if (!game) {
            throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }
        const awardGame: AwardEntity = game.awards.find(e => e.id === award.id);
        if (!awardGame) {
            throw new BusinessLogicException("The award with the given id is not associated to the game", BusinessError.PRECONDITION_FAILED);
        }
        game.awards = game.awards.filter(e => e.id !== awardId);
        await this.gameRepository.save(game);
    }
    
}
