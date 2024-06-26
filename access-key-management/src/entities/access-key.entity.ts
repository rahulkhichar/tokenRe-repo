import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AccessKey {
    @PrimaryGeneratedColumn()
    id: string; // Consider using a stronger identifier format (e.g., UUID)

    @Column()
    rateLimit: number;

    @Column()
    expiration: Date;

    @ManyToOne(() => User, (user) => user.accessKeys) // ManyToOne relationship
    user: User;

    // Add other key related fields as needed
}