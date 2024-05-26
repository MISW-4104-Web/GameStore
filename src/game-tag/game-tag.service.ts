import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from '../game/game.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { TagEntity } from '../tag/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameTagService {
    constructor(
        @InjectRepository(GameEntity)
        private readonly gameRepository: Repository<GameEntity>,
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>
    ) {}

    
    async addTagToGame(idGame: string, idTag: string): Promise<GameEntity> {

        const tag: TagEntity = await this.tagRepository.findOne({ where: {id: idTag} });
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

        if (!tag) {
            throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND);
        }

        if (!game) {
            throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND)
        }

        const tagSearched = game.tags.find((tagGame) => tagGame.id === tag.id );

        if (tagSearched) {
            throw new BusinessLogicException("The tag is already associated with this game", BusinessError.PRECONDITION_FAILED);
        }

        game.tags = [...game.tags, tag];

        return await this.gameRepository.save(game);

    }

    async findTagsByGameId(gameId: string): Promise<TagEntity[]> {
        const game: GameEntity = await this.gameRepository.findOne({where: {id: gameId}, relations: { tags: true }});
        if (!game) {
          throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND)
        }
        return game.tags;
    }

    async findTagByGameIdTagId(gameId: string, tagId: string): Promise<TagEntity> {
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}});
        if (!tag) {
          throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND);
        }
        const game: GameEntity = await this.gameRepository.findOne({where: {id: gameId}, relations: { tags: true }}); 
        if (!game) {
          throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }
        const gameTag: TagEntity = game.tags.find(e => e.id === tag.id);
    
        if (!gameTag){
          throw new BusinessLogicException("The tag with the given id is not associated to the game", BusinessError.PRECONDITION_FAILED);
        }
        return gameTag;
    }

    async updateTagsFromGame(gameId: string, tags: TagEntity[]): Promise<GameEntity> {
        const game: GameEntity = await this.gameRepository.findOne({where: {id: gameId}, relations: { tags: true }});
    
        if (!game){
          throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }
        for (let i = 0; i < tags.length; i++) {
          const tag: TagEntity = await this.tagRepository.findOne({where: {id: tags[i].id}});
          if (!tag)
            throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND);
        }
    
        game.tags = tags;
        return await this.gameRepository.save(game);
      }

    async deleteTagFromGame(tagId: string, gameId: string){
        const tag: TagEntity = await this.tagRepository.findOne({ where: { id: tagId } });
        if (!tag) {
            throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND);
        }
        const game: GameEntity = await this.gameRepository.findOne({ where: { id: gameId }, relations: { tags: true }});
        if (!game) {
            throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }
        const tagGame: TagEntity = game.tags.find(e => e.id === tag.id);
        if (!tagGame) {
            throw new BusinessLogicException("The tag with the given id is not associated to the game", BusinessError.PRECONDITION_FAILED);
        }
        game.tags = game.tags.filter(e => e.id !== tagId);
        await this.gameRepository.save(game);
    }


}
