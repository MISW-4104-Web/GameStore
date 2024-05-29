import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { GameService } from './game.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { GameEntity } from './game.entity';
import { GameDto } from './game.dto';
import { plainToInstance } from 'class-transformer';

@Controller('games')
@UseInterceptors(BusinessErrorsInterceptor)
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Get()
    async findAll() {
        return await this.gameService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.gameService.findOne(id);
    }

    @Post()
    async create(@Body() gameDto: GameDto) {
        const game: GameEntity = plainToInstance(GameEntity, gameDto);
        return await this.gameService.create(game);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() gameDto: GameDto) {
        const game: GameEntity = plainToInstance(GameEntity, gameDto);
        return await this.gameService.update(id, game);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.gameService.delete(id);
    }
}
