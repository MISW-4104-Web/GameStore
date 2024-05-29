import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { GameTagService } from './game-tag.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { TagDto } from 'src/tag/tag.dto';
import { TagEntity } from 'src/tag/tag.entity';

@Controller('games')
@UseInterceptors(BusinessErrorsInterceptor)
export class GameTagController {
    constructor(private readonly gameTagService: GameTagService) {}

    @Post(':gameId/tags/:tagId')
    async addTagToGame(@Param('gameId') gameId: string, @Param('tagId') tagId: string) {
        return await this.gameTagService.addTagToGame(gameId, tagId);
    }

    @Get(':gameId/tags')
    async findTagsByGameId(@Param('gameId') gameId: string) {
        return await this.gameTagService.findTagsByGameId(gameId);
    }

    @Get(':gameId/tags/:tagId')
    async findTagByGameIdTagId(@Param('gameId') gameId: string, @Param('tagId') tagId: string) {
        return await this.gameTagService.findTagByGameIdTagId(gameId, tagId);
    }

    @Put(':gameId/tags')
    async updateTagsFromGame(@Param('gameId') gameId: string, @Body() tagsDto: TagDto[]) {
        const tags: TagEntity[] = plainToInstance(TagEntity, tagsDto);
        return await this.gameTagService.updateTagsFromGame(gameId, tags);
    }

    @Delete(':gameId/tags/:tagId')
    @HttpCode(204)
    async deleteTagFromGame(@Param('gameId') gameId: string, @Param('tagId') tagId: string) {
        return await this.gameTagService.deleteTagFromGame(gameId, tagId);
    }
}
