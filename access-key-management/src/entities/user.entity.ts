import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AccessKey } from '../modules/access-key';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @OneToMany(() => AccessKey, (accessKey) => accessKey.user)
    accessKeys: AccessKey[];


}
