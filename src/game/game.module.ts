import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './game.entity';
import { GameService } from './game.service';
import { MinimumSpecEntity } from '../minimum-spec/minimum-spec.entity';
import { DevelopmentCompanyEntity } from '../development-company/development-company.entity';
import { GameController } from './game.controller';

@Module({
    imports: [TypeOrmModule.forFeature([GameEntity, MinimumSpecEntity, DevelopmentCompanyEntity])],
    providers: [GameService],
    controllers: [GameController],
})
export class GameModule {}
