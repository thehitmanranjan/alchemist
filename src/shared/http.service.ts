import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HttpService {
  async get(url: string) {
    const response = await axios.get(url);
    return response.data;
  }

  async post(url: string, data: any) {
    const response = await axios.post(url, data);
    return response.data;
  }
}
