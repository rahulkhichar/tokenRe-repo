import { Injectable } from "@nestjs/common";

import { User, AccessKey } from '../entities';
import { UserService } from "./user.service";
import { AccessKeyService } from "./access-key.service";
import { CreateAccessKeyDto } from "src/modules";

@Injectable()
export class AdminSerivce {
    constructor(
        private readonly accessKeyService: AccessKeyService,
        private readonly userService: UserService
    ) { }

    async createAccessKey(
        createAccessKeyDto: CreateAccessKeyDto
    ) {

        const user = await this.userService.findUserByUsername(createAccessKeyDto.username);
        return await this.accessKeyService.createAccessKey(createAccessKeyDto, user);

        // const newKey = new AccessKey();
        // newKey.id = uuidv4
        //     (); // Generate UUID
        // // newKey.user = user;
        // newKey.rateLimit = createAccessKeyDto.rateLimit;
        // newKey.expiration = createAccessKeyDto.expiration;
        // const savedKey = await this.accessKeyRepository.save(newKey);

        // // Publish key creation event to Redis
        // // const event: AccessKeyEvent = {
        // //     id: savedKey.id,
        // //     rateLimit: savedKey.rateLimit,
        // //     expiration: savedKey.expiration,
        // // };
        // // await this.redis.publish('access_key_created', JSON.stringify(event));
    }

    // async getAccessKeyById(id: string): Promise<AccessKey> {
    //     // const key = await this.accessKeyRepository.findOne({
    //     //     where: {
    //     //         id
    //     //     }
    //     // });
    //     // if (!key) {
    //     //     throw new NotFoundException('Access key not found');
    //     // }
    //     // return key;
    // }

    // async updateAccessKey(
    //     id: string,
    //     updateAccessKeyDto: UpdateAccessKeyDto,
    // ): Promise<AccessKey> {
    //     // const key = await this.getAccessKeyById(id);
    //     // key.rateLimit = updateAccessKeyDto.rateLimit ?? key.rateLimit;
    //     // key.expiration = updateAccessKeyDto.expiration ?? key.expiration;
    //     // const updatedKey = await this.accessKeyRepository.save(key);

    //     // // Publish key update event to Redis
    //     // const event: AccessKeyEvent = {
    //     //     id: updatedKey.id,
    //     //     rateLimit: updatedKey.rateLimit,
    //     //     expiration: updatedKey.expiration,
    //     // };
    //     // // await this.redis.publish('access_key_updated', JSON.stringify(event));

    //     // return updatedKey;
    // }

    // Add other methods for CRUD operations, user requests, etc.
}
