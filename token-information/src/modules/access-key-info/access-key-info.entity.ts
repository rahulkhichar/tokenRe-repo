import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';

@Entity()
@Index(['accessKey'], { unique: true })
export class AccessKey {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    accessKey: string;

    @Column()
    rateLimit: number;

    @Column()
    tokens: number;


    @Column()
    expiration: Date;

    @Column()
    lastRefill: Date;

}