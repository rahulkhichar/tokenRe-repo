import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisPubSubService } from '../redis';
import { AccessKey } from './access-key-info.entity';
import { AccessKeyRepository } from './access-key-info.repository';

@Injectable()
export class TokenService {

    constructor(private readonly accessKeyRepository: AccessKeyRepository) {

    }


    async saveToken(accessKey: Partial<AccessKey>): Promise<any> {
        return this.accessKeyRepository.save(accessKey);

    }

    private async checkRateLimit(keyDetails: Partial<AccessKey>): Promise<void> {
        const tokens = keyDetails.tokens;
        const rateLimit = keyDetails.rateLimit;
        const lastRefill = new Date(keyDetails.lastRefill).getTime();
        const now = Date.now();

        const elapsedSeconds = (now - lastRefill) / 1000;
        const refillRate = rateLimit / 60;
        const newTokens = Math.min(rateLimit, tokens + Math.floor(elapsedSeconds * refillRate));

        if (newTokens > 0) {
            await this.accessKeyRepository.save({
                id: keyDetails.id,
                tokens: (newTokens - 1),
                lastRefill: now,
            })

        } else {
            throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
        }
    }

    private async validateKey(keyDetails: Partial<AccessKey>): Promise<Partial<AccessKey>> {

        if (Date.now() > keyDetails.expiration.getTime()) {
            throw new HttpException('Key has expired', HttpStatus.UNAUTHORIZED);
        }

        return keyDetails;
    }


    async getTokenInfo(key: string): Promise<any> {

        const accessToken = await this.accessKeyRepository.findOne({
            where: {
                accessKey: key
            }
        });
        if (!accessToken) {
            throw new HttpException('Invalid key', HttpStatus.UNAUTHORIZED);

        }
        await this.validateKey(accessToken);
        await this.checkRateLimit(accessToken);

        return {
            name: "Getting Response Successfully",
        };
    }



}
