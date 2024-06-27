import { Injectable } from '@nestjs/common';
import { UserRepository } from '../Repositories/user.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async findUserByUsername(username: string): Promise<User | undefined> {
        return await this.userRepository.findOne({
            where: {
                username
            },
            relations: ['accessKeys']
        });
    }

    async addUser(username: string): Promise<User | undefined> {
        const user = await this.userRepository.saveUser(username);

        return user;
    }

}