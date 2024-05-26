import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from './game.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { MinimumSpecEntity } from '../minimum-spec/minimum-spec.entity';
import { DevelopmentCompanyEntity } from '../development-company/development-company.entity';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameEntity)
        private readonly gameRepository: Repository<GameEntity>,
        @InjectRepository(MinimumSpecEntity)
        private readonly minSpecRepository: Repository<MinimumSpecEntity>,
        @InjectRepository(DevelopmentCompanyEntity)
        private readonly devCompRepository: Repository<DevelopmentCompanyEntity>
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
        const {devComp, minReqs} = await this.validateRelations(game);

        game.developmentCompany = devComp;

        game.minimumRequirements = minReqs;

        return await this.gameRepository.save(game);
    }

    async update(id: string, game: GameEntity): Promise<GameEntity> {
        const persistedGame = await this.gameRepository.findOne({
            where: {id}
        });

        if (!persistedGame) {
            throw new BusinessLogicException("The game with the given id was not found", BusinessError.NOT_FOUND);
        }

        const {devComp, minReqs} = await this.validateRelations(game);

        game.developmentCompany = devComp;

        game.minimumRequirements = minReqs;

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

    validateRelations = async (game: GameEntity) => {
        if (!game.developmentCompany || !game.developmentCompany.id) {
            throw new BusinessLogicException("The game needs a development company to be created", BusinessError.BAD_REQUEST);
        }

        const devComp: DevelopmentCompanyEntity =  await this.devCompRepository.findOne({
            where: {id: game.developmentCompany.id}
        });

        if (!devComp) {
            throw new BusinessLogicException("The development company with the given id was not found", BusinessError.NOT_FOUND);
        }

        if (!game.minimumRequirements || !game.minimumRequirements.id) {
            throw new BusinessLogicException("The game needs minimum requirements to be created", BusinessError.BAD_REQUEST);
        }

        const minReqs: MinimumSpecEntity = await this.minSpecRepository.findOne({
            where: {id: game.minimumRequirements.id}
        });

        if (!minReqs) {
            throw new BusinessLogicException("The minimum requirements with the given id was not found", BusinessError.NOT_FOUND);
        }

        return {devComp, minReqs};
    }

}
