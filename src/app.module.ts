import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { TagModule } from './tag/tag.module';
import { GameTagModule } from './game-tag/game-tag.module';
import { TagGameModule } from './tag-game/tag-game.module';
import { ReviewModule } from './review/review.module';
import { DevelopmentCompanyModule } from './development-company/development-company.module';
import { AwardModule } from './award/award.module';
import { GameAwardModule } from './game-award/game-award.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './game/game.entity';
import { TagEntity } from './tag/tag.entity';
import { MinimumSpecEntity } from './minimum-spec/minimum-spec.entity';
import { DevelopmentCompanyEntity } from './development-company/development-company.entity';
import { AwardEntity } from './award/award.entity';
import { ReviewEntity } from './review/review.entity';
import { MinimumSpecModule } from './minimum-spec/minimum-spec.module';

@Module({
  imports: [GameModule, TagModule, GameTagModule, TagGameModule, ReviewModule, DevelopmentCompanyModule, MinimumSpecModule, AwardModule, GameAwardModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'gamestore',
      entities: [GameEntity, TagEntity, MinimumSpecEntity, DevelopmentCompanyEntity, AwardEntity, ReviewEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    MinimumSpecModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
