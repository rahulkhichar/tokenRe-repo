import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccessKeyDto, UpdateAccessKeyDto } from '../modules/access-key/dto';
import { AccessKeyRepository } from '../Repositories/access-key.repository';
import { AccessKey, User } from 'src/entities';

export interface AccessKeyEvent {
    id: string;
    rateLimit: number;
    expiration: Date;
}

@Injectable()
export class AccessKeyService {
    constructor(
        private readonly accessKeyRepository: AccessKeyRepository,
        // @InjectRedis() private readonly redis: Redis,
    ) { }

    async createAccessKey(
        createAccessKeyDto: CreateAccessKeyDto,
        user: User
    ): Promise<AccessKey> {

        try {
            const newKey = new AccessKey();
            newKey.user = user;
            newKey.rateLimit = createAccessKeyDto.rateLimit;
            newKey.expiration = createAccessKeyDto.expiration;
            const savedKey = await this.accessKeyRepository.save(newKey);

            // Publish key creation event to Redis
            // const event: AccessKeyEvent = {
            //     id: savedKey.id,
            //     rateLimit: savedKey.rateLimit,
            //     expiration: savedKey.expiration,
            // };
            // await this.redis.publish('access_key_created', JSON.stringify(event));


            return savedKey;
        } catch (error) {

            console.log(error);

        }
    }

    async getAccessKeyById(id: string): Promise<AccessKey> {
        const key = await this.accessKeyRepository.findOne({
            where: {
                id
            }
        });
        if (!key) {
            throw new NotFoundException('Access key not found');
        }
        return key;
    }

    async updateAccessKey(
        id: string,
        updateAccessKeyDto: UpdateAccessKeyDto,
    ): Promise<AccessKey> {
        const key = await this.getAccessKeyById(id);
        key.rateLimit = updateAccessKeyDto.rateLimit ?? key.rateLimit;
        key.expiration = updateAccessKeyDto.expiration ?? key.expiration;
        const updatedKey = await this.accessKeyRepository.save(key);

        // Publish key update event to Redis
        const event: AccessKeyEvent = {
            id: updatedKey.id,
            rateLimit: updatedKey.rateLimit,
            expiration: updatedKey.expiration,
        };
        // await this.redis.publish('access_key_updated', JSON.stringify(event));

        return updatedKey;
    }

    async deleteAccessKey(
        id: string
    ): Promise<void> {
        await this.accessKeyRepository.delete(id);
    }

    async listAllAccessKeys(
    ): Promise<AccessKey[]> {
        return await this.accessKeyRepository.find({});

    }

}
