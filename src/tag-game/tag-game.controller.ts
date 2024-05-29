import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { TagGameService } from './tag-game.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { GameDto } from 'src/game/game.dto';
import { GameEntity } from 'src/game/game.entity';

@Controller('tags')
@UseInterceptors(BusinessErrorsInterceptor)
export class TagGameController {
    constructor(private readonly tagGameService: TagGameService) {}

    @Post(':tagId/games/:gameId')
    async addGameToTag(@Param('tagId') tagId: string, @Param('gameId') gameId: string) {
        return await this.tagGameService.addGameToTag(tagId, gameId);
    }

    @Get(':tagId/games')
    async findGamesByTagId(@Param('tagId') tagId: string) {
        return await this.tagGameService.findGamesByTagId(tagId);
    }

    @Get(':tagId/games/:gameId')
    async findGameByTagIdGameId(@Param('tagId') tagId: string, @Param('gameId') gameId: string) {
        return await this.tagGameService.findGameByTagIdGameId(tagId, gameId);
    }

    @Put(':tagId/games')
    async updateGamesFromTag(@Param('tagId') tagId: string, @Body() gamesDto: GameDto[]) {
        const games: GameEntity[] = plainToInstance(GameEntity, gamesDto);
        return await this.tagGameService.updateGamesFromTag(tagId, games);
    }

    @Delete(':tagId/games/:gameId')
    @HttpCode(204)
    async deleteGameFromTag(@Param('tagId') tagId: string, @Param('gameId') gameId: string) {
        return await this.tagGameService.deleteGameFromTag(tagId, gameId);
    }
}
