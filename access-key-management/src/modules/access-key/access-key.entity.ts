import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../User';

@Entity()
export class AccessKey {
    @PrimaryGeneratedColumn()
    id: string; // Consider using a stronger identifier format (e.g., UUID)

    @Column()
    rateLimit: number;

    @Column()
    expiration: Date;

    @ManyToOne(() => User)
    user: User;

    // Add other key related fields as needed
}