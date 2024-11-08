import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService],
  imports: [PrismaModule],
})
export class StatisticModule {}
