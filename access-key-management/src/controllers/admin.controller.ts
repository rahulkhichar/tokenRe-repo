import { Controller, Get, Post, Put, Param, Body, Delete } from '@nestjs/common';
// import { AccessKeyService } from './access-key.service';

import { CreateAccessKeyDto, UpdateAccessKeyDto } from '../modules/access-key/dto';

import { AdminSerivce } from '../services/admin.service';

@Controller('admin/access-keys')
export class AdminController {
    constructor(private readonly adminService: AdminSerivce,
        // private readonly userService: UserService
    ) { }

    @Post()
    async createAccessKey(
        @Body() createAccessKeyDto: CreateAccessKeyDto,
    ): Promise<any> {
        return await this.adminService.createAccessKey(createAccessKeyDto);
    }

    @Get(':id')
    async getAccessKeyById(@Param('id') id: string): Promise<any> {
        return await this.adminService.getAccessKeyById(id);
    }

    @Put(':id')
    async updateAccessKey(
        @Param('id') id: string,
        @Body() updateAccessKeyDto: UpdateAccessKeyDto,
    ): Promise<any> {
        return await this.adminService.updateAccessKey(id, updateAccessKeyDto);
    }

    @Delete(':id')
    async deleteAccessKey(@Param('id') id: string): Promise<void> {
        await this.adminService.deleteAccessKey(id);
    }


    @Get()
    async getAllAccessKeys(): Promise<any[]> {
        return await this.adminService.getAllAccessKeys();
    }
}
