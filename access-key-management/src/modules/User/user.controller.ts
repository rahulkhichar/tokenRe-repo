import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from './interface';
import { User } from './user.entity';
// import { AccessKeyService } from './access-key.service';
// import { JwtAuthGuard } (replace with your JWT Authentication Guard)

@Controller('user')
export class UserController {
    constructor(private readonly userSerice: UserService) { }

    // @Get('plan-details')
    // // @UseGuards(JwtAuthGuard) // Implement JWT Authentication (replace with your guard)
    // async getUserPlanDetails(@CurrentUser() user: any): Promise<any> {
    //     const key = user.accessKey; // Replace with logic to retrieve key based on user
    //     return await this.accessKeyService.getUserPlanDetails(key);
    // }

    // @Put('disable-key')
    // @UseGuards(JwtAuthGuard) // Implement JWT Authentication (replace with your guard)
    // async disableAccessKey(@CurrentUser() user: any): Promise<void> {
    //     const key = user.accessKey; // Replace with logic to retrieve key based on user
    //     await this.accessKeyService.disableAccessKey(key);
    // }

    @Get('/:username')
    // @UseGuards(JwtAuthGuard) // Implement JWT Authentication (replace with your guard)
    async getUserByUsername(
        @Param('username') username: string
    ): Promise<User> {

        const user = await this.userSerice.findUserByUsername(username);
        return user;

    }


    @Post('')
    // @UseGuards(JwtAuthGuard) // Implement JWT Authentication (replace with your guard)
    async saveUserByUsername(
        @Body() user: IUser
    ): Promise<User> {

        const response = await this.userSerice.addUser(user.username);
        return response;
    }
}