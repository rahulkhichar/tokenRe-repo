import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AccessKey } from './access-key-info.entity';

@Injectable()
export class AccessKeyRepository extends Repository<AccessKey> {

    constructor(
        private datasource: DataSource,
    ) {
        super(AccessKey, datasource.createEntityManager());
    }

}