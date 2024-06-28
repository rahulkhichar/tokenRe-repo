import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AccessKey {
    @PrimaryGeneratedColumn('uuid') // Use 'uuid' for UUID generation
    id: string;

    @Column()
    rateLimit: number;

    @Column()
    tokens: number;


    @Column()
    expiration: Date;

    @ManyToOne(() => User, (user) => user.accessKeys) // ManyToOne relationship
    user: User;

    // Add other key related fields as needed
}