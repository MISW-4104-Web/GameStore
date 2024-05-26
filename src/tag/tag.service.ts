import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>
    ) {}

        
    async findAll(): Promise<TagEntity[]> {
        return await this.tagRepository.find({
            relations: {
                games: {
                    developmentCompany: true,
                    minimumRequirements: true
                }
            }
        });
    }

    async findOne(id: string): Promise<TagEntity> {
        const tag = await this.tagRepository.findOne({
            where: {id},
            relations: {
                games: {
                    developmentCompany: true,
                    minimumRequirements: true
                }
            }
        });

        if (!tag) {
            throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND);
        }

        return tag;
    }

    async create(tag: TagEntity): Promise<TagEntity> {
        return await this.tagRepository.save(tag);
    }

    async update(id: string, tag: TagEntity): Promise<TagEntity> {
        const persistedTag = await this.tagRepository.findOne({
            where: {id}
        });

        if (!persistedTag) {
            throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND);
        }

        return await this.tagRepository.save({...persistedTag, ...tag});
    }

    async delete(id: string) {
        const persistedTag = await this.tagRepository.findOne({
            where: {id}
        });

        if(!persistedTag) {
            throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.tagRepository.remove(persistedTag);
    }   
}
