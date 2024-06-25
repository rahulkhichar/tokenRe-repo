import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) { }

    async findUserByUsername(username: string): Promise<User | undefined> {
        return await this.userRepository.findOne({
            where: {
                username
            }
        });
    }

    async addUser(username: string): Promise<User | undefined> {
        const user = await this.userRepository.saveUser(username);

        return user;
    }

}