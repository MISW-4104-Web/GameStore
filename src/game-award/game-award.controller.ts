import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { GameAwardService } from './game-award.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AwardDto } from 'src/award/award.dto';
import { AwardEntity } from 'src/award/award.entity';
import { plainToInstance } from 'class-transformer';

@Controller('games')
@UseInterceptors(BusinessErrorsInterceptor)
export class GameAwardController {
    constructor(private readonly gameAwardService: GameAwardService) {}

    @Post(':gameId/awards/:awardId')
    async addAwardToGame(@Param('gameId') gameId: string, @Param('awardId') awardId: string) {
        return await this.gameAwardService.addAwardToGame(gameId, awardId);
    }

    @Get(':gameId/awards')
    async findAwardsByGameId(@Param('gameId') gameId: string) {
        return await this.gameAwardService.findAwardsByGameId(gameId);
    }

    @Get(':gameId/awards/:awardId')
    async findAwardByGameIdAwardId(@Param('gameId') gameId: string, @Param('awardId') awardId: string) {
        return await this.gameAwardService.findAwardByGameIdAwardId(gameId, awardId);
    }

    @Put(':gameId/awards')
    async updateAwardsFromGame(@Param('gameId') gameId: string, @Body() awardsDto: AwardDto[]) {
        const awards: AwardEntity[] = plainToInstance(AwardEntity, awardsDto);
        return await this.gameAwardService.updateAwardsFromGame(gameId, awards);
    }

    @Delete(':gameId/awards/:awardId')
    @HttpCode(204)
    async deleteAwardFromGame(@Param('gameId') gameId: string, @Param('awardId') awardId: string) {
        return await this.gameAwardService.deleteAwardFromGame(gameId, awardId);
    }
}
