import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccessKeyDto, UpdateAccessKeyDto } from '../modules/access-key/dto';
import { AccessKeyRepository } from '../Repositories/access-key.repository';
import { AccessKey, User } from 'src/entities';
import { RedisPubSubService } from 'src/modules/redis';




@Injectable()
export class AccessKeyService {

    constructor(
        private readonly accessKeyRepository: AccessKeyRepository,
        private readonly redisPubSubService: RedisPubSubService,
    ) { }

    async onModuleInit() {

    }

    async createAccessKey(
        createAccessKeyDto: CreateAccessKeyDto,
        user: User
    ): Promise<AccessKey> {

        try {
            const newKey = new AccessKey();
            newKey.user = user;
            newKey.rateLimit = createAccessKeyDto.rateLimit;
            newKey.expiration = createAccessKeyDto.expiration;
            newKey.tokens = createAccessKeyDto.tokens;
            const savedKey = await this.accessKeyRepository.save(newKey);

            const event = {
                id: savedKey.id,
                rateLimit: savedKey.rateLimit,
                expiration: savedKey.expiration,
                tokens: savedKey.tokens
            };

            this.redisPubSubService.publish('access-key', JSON.stringify(event)).catch((err) => {
                console.log(" here", err);
            }).then((val) => { console.log(val); });
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
        const event = {
            id: updatedKey.id,
            rateLimit: updatedKey.rateLimit,
            expiration: updatedKey.expiration,
            tokens: updateAccessKeyDto.tokens
        };

        this.redisPubSubService.publish('access-key', JSON.stringify(event)).catch((err) => {
            console.log(" here", err);
        }).then((val) => { console.log(val); });

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
