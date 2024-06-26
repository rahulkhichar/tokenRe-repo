import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
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
        // Implement logic to find/create user based on username in dto
        // const user = await this.userService.findUserByUsername(createAccessKeyDto.username);
        return await this.adminService.createAccessKey(createAccessKeyDto);
    }

    // @Get(':id')
    // async getAccessKeyById(@Param('id') id: string): Promise<any> {
    //     return await this.accessKeyService.getAccessKeyById(id);
    // }

    // @Put(':id')
    // async updateAccessKey(
    //     @Param('id') id: string,
    //     @Body() updateAccessKeyDto: UpdateAccessKeyDto,
    // ): Promise<any> {
    //     return await this.accessKeyService.updateAccessKey(id, updateAccessKeyDto);
    // }

    // @Delete(':id')
    // async deleteAccessKey(@Param('id') id: string): Promise<void> {
    //     await this.accessKeyService.deleteAccessKey(id);
    // }

    // Add other admin related methods as needed, 
    // for example, listing all access keys
    // @Get()
    // async getAllAccessKeys(): Promise<any[]> {
    //     return await this.accessKeyService.getAllAccessKeys();
    // }
}
