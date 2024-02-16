import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { PayType } from '../../types/pay.type';
import { TimeSheet } from './time.sheet.entity';

@Entity({ name: 'employees', schema: 'generic' })

export class Employee {

    @PrimaryGeneratedColumn()
    employee_id: number;

    @Column()
    employee_name: string;

    @Column()
    employee_lastname: string;

    @Column({ type: 'enum', enum: PayType, default: PayType.SALARY })
    employee_pay_type: PayType;

    @Column()
    employee_pay_rate: number;

    @Column()
    employee_created_at: Date;

    @ManyToOne(() => User, user => user.employees)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => TimeSheet, time_sheet => time_sheet.employee)
    time_sheets: TimeSheet[];
}