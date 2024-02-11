import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Profile } from './profile.entity';
import { Employee } from './employee.entity';
import { UserType } from 'src/types/user.type';

@Entity({ name: 'users', schema: 'generic' })

export class User {

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    user_name: string;

    @Column()
    user_lastname: string;

    @Column({ type: 'enum', enum: UserType, default: UserType.CLIENT })
    user_type: string;

    @Column()
    user_email: string;

    @Column()
    user_password: string;

    @Column()
    user_created_at: Date;

    @ManyToOne(() => Profile)
    @JoinColumn({ name: 'profile_id' })
    profile: Profile;

    @Column()
    profile_id: number;

    @Column()
    user_avatar: string;

    @OneToMany(() => Employee, employee => employee.user)
    employees: Employee[];
}