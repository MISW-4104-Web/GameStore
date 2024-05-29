import { Module } from '@nestjs/common';
import { MinimumSpecService } from './minimum-spec.service';
import { MinimumSpecEntity } from './minimum-spec.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinimumSpecController } from './minimum-spec.controller';

@Module({
  providers: [MinimumSpecService],
  imports: [TypeOrmModule.forFeature([MinimumSpecEntity])],
  controllers: [MinimumSpecController],
})
export class MinimumSpecModule {}
