import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'employees', schema: 'generic' })

export class Employee {

    @PrimaryGeneratedColumn()
    employee_id: number;

    @Column()
    employee_name: string;

    @Column()
    employee_lastname: string;

    @Column()
    employee_created_at: Date;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user_id: User;
}