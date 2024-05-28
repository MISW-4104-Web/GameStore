import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '../tag/tag.entity';
import { Repository } from 'typeorm';
import { GameEntity } from '../game/game.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class TagGameService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>,
        @InjectRepository(GameEntity)
        private readonly gameRepository: Repository<GameEntity>
    ) {}

    
    async addGameToTag(idTag: string, idGame: string): Promise<TagEntity> {

        const game: GameEntity = await this.gameRepository.findOne({ where: {id: idGame} });
        const tag: TagEntity = await this.tagRepository.findOne(
            { 
                where: {id: idTag},
                relations: {
                    games: {
                        developmentCompany: true,
                        minimumRequirements: true
                    }
                }
            }
        );

        if (!game) {
            throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }

        if (!tag) {
            throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND)
        }

        const gameSearched = tag.games.find((gameTag) => gameTag.id === game.id );

        if (gameSearched) {
            throw new BusinessLogicException("The game is already associated with this tag", BusinessError.PRECONDITION_FAILED);
        }

        tag.games = [...tag.games, game];

        return await this.tagRepository.save(tag);

    }

    async findGamesByTagId(tagId: string): Promise<GameEntity[]> {
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}, relations: { games: true }});
        if (!tag) {
          throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND)
        }
        return tag.games;
    }

    async findGameByTagIdgameId(tagId: string, gameId: string): Promise<GameEntity> {
        const game: GameEntity = await this.gameRepository.findOne({where: {id: gameId}});
        if (!game) {
          throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}, relations: { games: true }}); 
        if (!tag) {
          throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND);
        }
        const tagGame: GameEntity = tag.games.find(e => e.id === game.id);
    
        if (!tagGame){
          throw new BusinessLogicException("The game with the given id is not associated to the tag", BusinessError.PRECONDITION_FAILED);
        }
        return tagGame;
    }

    async updateGamesFromTag(tagId: string, games: GameEntity[]): Promise<TagEntity> {
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}, relations: { games: true }});
    
        if (!tag){
          throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND);
        }
        for (let i = 0; i < games.length; i++) {
          const game: GameEntity = await this.gameRepository.findOne({where: {id: games[i].id}});
          if (!game)
            throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }
    
        tag.games = games;
        return await this.tagRepository.save(tag);
      }

    async deleteGameFromTag(tagId: string, gameId: string){
        const game: GameEntity = await this.gameRepository.findOne({ where: { id: gameId } });
        if (!game) {
            throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }
        const tag: TagEntity = await this.tagRepository.findOne({ where: { id: tagId }, relations: { games: true }});
        if (!tag) {
            throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND);
        }
        const gameTag: GameEntity = tag.games.find(e => e.id === game.id);
        if (!gameTag) {
            throw new BusinessLogicException("The game with the given id is not associated to the tag", BusinessError.PRECONDITION_FAILED);
        }
        tag.games = tag.games.filter(e => e.id !== gameId);
        await this.tagRepository.save(tag);
    }



}
