import { TypeOrmModule } from "@nestjs/typeorm";
import { AwardEntity } from "../../award/award.entity";
import { DevelopmentCompanyEntity } from "../../development-company/development-company.entity";
import { GameEntity } from "../../game/game.entity";
import { MinimumSpecEntity } from "../../minimum-spec/minimum-spec.entity";
import { ReviewEntity } from "../../review/review.entity";
import { TagEntity } from "../../tag/tag.entity";

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [GameEntity, TagEntity, MinimumSpecEntity, DevelopmentCompanyEntity, AwardEntity, ReviewEntity],
      synchronize: true,
      keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([GameEntity, TagEntity, MinimumSpecEntity, DevelopmentCompanyEntity, AwardEntity, ReviewEntity]),
];
   