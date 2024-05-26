import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MinimumSpecEntity } from './minimum-spec.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class MinimumSpecService {
    constructor(
        @InjectRepository(MinimumSpecEntity)
        private readonly minimimSpecRepository: Repository<MinimumSpecEntity>
    ) {}

    
    async findAll(): Promise<MinimumSpecEntity[]> {
        return await this.minimimSpecRepository.find({
            relations: {
                games: {
                    developmentCompany: true
                }
            }
        });
    }

    async findOne(id: string): Promise<MinimumSpecEntity> {
        const minSpec = await this.minimimSpecRepository.findOne({
            where: {id},
            relations: {
                games: {
                    developmentCompany: true
                }
            }
        });

        if (!minSpec) {
            throw new BusinessLogicException("The minimum spec with the given id was not found", BusinessError.NOT_FOUND);
        }

        return minSpec;
    }

    async create(minSpec: MinimumSpecEntity): Promise<MinimumSpecEntity> {
        return await this.minimimSpecRepository.save(minSpec);
    }

    async update(id: string, minSpec: MinimumSpecEntity): Promise<MinimumSpecEntity> {
        const persistedMinSpec = await this.minimimSpecRepository.findOne({
            where: {id}
        });

        if (!persistedMinSpec) {
            throw new BusinessLogicException("The minimum spec with the given id was not found", BusinessError.NOT_FOUND);
        }

        return await this.minimimSpecRepository.save({...persistedMinSpec, ...minSpec});
    }

    async delete(id: string) {
        const persistedMinSpec = await this.minimimSpecRepository.findOne({
            where: {id}
        });

        if(!persistedMinSpec) {
            throw new BusinessLogicException("The minimum spec with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.minimimSpecRepository.remove(persistedMinSpec);
    }   

}
