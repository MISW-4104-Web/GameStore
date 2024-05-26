import { Module } from '@nestjs/common';
import { MinimumSpecService } from './minimum-spec.service';
import { MinimumSpecEntity } from './minimum-spec.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [MinimumSpecService],
  imports: [TypeOrmModule.forFeature([MinimumSpecEntity])],
})
export class MinimumSpecModule {}
