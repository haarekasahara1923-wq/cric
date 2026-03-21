import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { SettlementModule } from '../settlement/settlement.module';

@Module({
  imports: [SettlementModule],
  controllers: [AdminController],
})
export class AdminModule {}
