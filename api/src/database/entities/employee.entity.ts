import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { PayType } from 'src/types/pay.type';

@Entity({ name: 'employees', schema: 'generic' })

export class Employee {

    @PrimaryGeneratedColumn()
    employee_id: number;

    @Column()
    employee_name: string;

    @Column()
    employee_lastname: string;

    @Column({ type: 'enum', enum: PayType, default: PayType.SALARY })
    employee_pay_type: string;

    @Column()
    employee_pay_rate: number;

    @Column()
    employee_created_at: Date;

    @ManyToOne(() => User, user => user.employees)
    @JoinColumn({ name: 'user_id' })
    user: User;
}