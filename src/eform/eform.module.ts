import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    ReportModule,
    RouterModule.register([
      { path: 'eform/report', module: ReportModule },
    ]),
  ],
})
export class EformModule {}
