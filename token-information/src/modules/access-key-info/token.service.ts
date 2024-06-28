import { Injectable } from '@nestjs/common';
import { RedisPubSubService } from '../redis';

@Injectable()
export class TokenService {

    constructor(private readonly redisPubSubService: RedisPubSubService) {

    }

    async getTokenInfo(key: string): Promise<any> {
        return this.redisPubSubService.getTokenInfo(key);
    }


}
