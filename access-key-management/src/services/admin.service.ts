import { Injectable, OnModuleInit } from "@nestjs/common";

import { User, AccessKey } from '../entities';
import { UserService } from "./user.service";
import { AccessKeyService } from "./access-key.service";
import { CreateAccessKeyDto, UpdateAccessKeyDto } from "src/modules";
import { RedisPubSubService } from "src/modules/redis/redis-pubsub.service";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class AdminSerivce {
    constructor(
        private readonly accessKeyService: AccessKeyService,
        private readonly userService: UserService,
    ) { }


    async createAccessKey(
        createAccessKeyDto: CreateAccessKeyDto
    ) {

        const user = await this.userService.findUserByUsername(createAccessKeyDto.username);
        return await this.accessKeyService.createAccessKey(createAccessKeyDto, user);

    }

    async getAccessKeyById(id: string): Promise<AccessKey> {
        const key = await this.accessKeyService.getAccessKeyById(id);
        return key;
    }



    async updateAccessKey(
        id: string,
        updateAccessKeyDto: UpdateAccessKeyDto,
    ): Promise<AccessKey> {

        return this.accessKeyService.updateAccessKey(id, updateAccessKeyDto);
    }

    async deleteAccessKey(id: string): Promise<void> {

        await this.accessKeyService.deleteAccessKey(id);

    }

    async getAllAccessKeys(): Promise<AccessKey[]> {

        return await this.accessKeyService.listAllAccessKeys();

    }


}
