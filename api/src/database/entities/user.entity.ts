import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './profile.entity';

@Entity({ name: 'users', schema: 'generic' })

export class User {

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    user_name: string;

    @Column()
    user_lastname: string;

    @Column()
    user_type: string;

    @Column()
    user_email: string;

    @Column()
    user_password: string;

    @Column()
    user_created_at: Date;

    @OneToOne(() => Profile)
    @JoinColumn({ name: 'profile_id' })
    profile: Profile;

    @Column()
    profile_id: number;

    @Column()
    user_avatar: string;
}