import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {

    constructor(
        private datasource: DataSource,
    ) {
        super(User, datasource.createEntityManager());
    }

    async findUserByUsername(username: string): Promise<User | undefined> {
        const data = await this.findOne({
            where: {
                username
            }
        });
        return data;
    }

    async saveUser(username: string): Promise<User | undefined> {
        const data = await this.save({
            username
        });
        return data;
    }
}