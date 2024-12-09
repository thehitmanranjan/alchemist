import { Module } from '@nestjs/common';
import { AlgorithmService } from './algorithm.service';
import { HttpService } from './http.service';

@Module({
  providers: [AlgorithmService, HttpService],
  exports: [AlgorithmService, HttpService],
})
export class SharedModule {}
