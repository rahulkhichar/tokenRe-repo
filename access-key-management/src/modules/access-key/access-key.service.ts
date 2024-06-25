import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { InjectRedis } from '@nestjs/redis';
// import { Redis } from 'redis';
import { Repository } from 'typeorm';
import { AccessKey } from './access-key.entity';
// import { CreateAccessKeyDto, UpdateAccessKeyDto } from './dto';
import { v4 as uuidv4 } from 'uuid'; // For generating UUIDs
import { User } from '../User';
import { UpdateAccessKeyDto } from './dto';
import { AccessKeyRepository } from './access-key.repository';

// Define event interface (replace with actual event details)
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
        user: User,
        rateLimit: number,
        expiration: Date,
    ): Promise<AccessKey> {
        const newKey = new AccessKey();
        newKey.id = uuidv4(); // Generate UUID
        newKey.user = user;
        newKey.rateLimit = rateLimit;
        newKey.expiration = expiration;
        const savedKey = await this.accessKeyRepository.save(newKey);

        // Publish key creation event to Redis
        // const event: AccessKeyEvent = {
        //     id: savedKey.id,
        //     rateLimit: savedKey.rateLimit,
        //     expiration: savedKey.expiration,
        // };
        // await this.redis.publish('access_key_created', JSON.stringify(event));

        return savedKey;
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

    // Add other methods for CRUD operations, user requests, etc.
}
