import { Injectable } from '@nestjs/common';

@Injectable()
export class AlgorithmService {
  reallocateFunds() {
    // Call the Go service to perform smart allocation
    return { message: 'Portfolio reallocation triggered' };
  }
}
