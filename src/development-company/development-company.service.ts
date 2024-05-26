import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DevelopmentCompanyEntity } from './development-company.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class DevelopmentCompanyService {
    constructor(
        @InjectRepository(DevelopmentCompanyEntity)
        private readonly devCompRepository: Repository<DevelopmentCompanyEntity>
    ) {}

    async findAll(): Promise<DevelopmentCompanyEntity[]> {
        return await this.devCompRepository.find({
            relations: {
                games: {
                    minimumRequirements: true,
                }
            }
        });
    }

    async findOne(id: string): Promise<DevelopmentCompanyEntity> {
        const devComp = await this.devCompRepository.findOne({
            where: {id},
            relations: {
                games: {
                    minimumRequirements: true,
                }
            }
        });

        if (!devComp) {
            throw new BusinessLogicException("The development company with the given id was not found", BusinessError.NOT_FOUND);
        }

        return devComp;
    }

    async create(devComp: DevelopmentCompanyEntity): Promise<DevelopmentCompanyEntity> {
        return await this.devCompRepository.save(devComp);
    }

    async update(id: string, devComp: DevelopmentCompanyEntity): Promise<DevelopmentCompanyEntity> {
        const persistedDevComp = await this.devCompRepository.findOne({
            where: {id}
        });

        if (!persistedDevComp) {
            throw new BusinessLogicException("The development company with the given id was not found", BusinessError.NOT_FOUND);
        }

        return await this.devCompRepository.save({...persistedDevComp, ...devComp});
    }

    async delete(id: string) {
        const persistedDevComp = await this.devCompRepository.findOne({
            where: {id}
        });

        if(!persistedDevComp) {
            throw new BusinessLogicException("The development company with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.devCompRepository.remove(persistedDevComp);
    }   
}
