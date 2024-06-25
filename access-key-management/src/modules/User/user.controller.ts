import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from './interface';
import { User } from './user.entity';


@Controller('user')
export class UserController {
    constructor(private readonly userSerice: UserService) { }



    @Get('/:username')
    async getUserByUsername(
        @Param('username') username: string
    ): Promise<User> {

        const user = await this.userSerice.findUserByUsername(username);
        return user;

    }


    @Post('')
    async saveUserByUsername(
        @Body() user: IUser
    ): Promise<User> {

        const response = await this.userSerice.addUser(user.username);
        return response;
    }
}