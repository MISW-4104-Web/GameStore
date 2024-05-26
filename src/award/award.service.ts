import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwardEntity } from './award.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AwardService {
    constructor(
        @InjectRepository(AwardEntity)
        private readonly awardRepository: Repository<AwardEntity>
    ) {}

    async findAll(): Promise<AwardEntity[]> {
        return await this.awardRepository.find({
            relations: {
                game: {
                    developmentCompany: true,
                    minimumRequirements: true,
                },
            }
        });
    }

    async findOne(id: string): Promise<AwardEntity> {
        const award = await this.awardRepository.findOne({
            where: {id},
            relations: {
                game: {
                    developmentCompany: true,
                    minimumRequirements: true,
                },
            }
        });

        if (!award) {
            throw new BusinessLogicException("The award with the given id was not found", BusinessError.NOT_FOUND);
        }

        return award;
    }

    async create(award: AwardEntity): Promise<AwardEntity> {
        return await this.awardRepository.save(award);
    }

    async update(id: string, award: AwardEntity): Promise<AwardEntity> {
        const persistedAward = await this.awardRepository.findOne({
            where: {id}
        });

        if (!persistedAward) {
            throw new BusinessLogicException("The award with the given id was not found", BusinessError.NOT_FOUND);
        }

        return await this.awardRepository.save({...persistedAward, ...award});
    }

    async delete(id: string) {
        const persistedAward = await this.awardRepository.findOne({
            where: {id}
        });

        if(!persistedAward) {
            throw new BusinessLogicException("The award with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.awardRepository.remove(persistedAward);
    }
}
