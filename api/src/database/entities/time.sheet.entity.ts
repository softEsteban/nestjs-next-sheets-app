import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity({ name: 'sheet_time', schema: 'generic' })

export class TimeSheet {

    @PrimaryGeneratedColumn()
    sheet_id: number;

    @OneToOne(() => Employee)
    @JoinColumn({ name: 'employee_id' })
    employee_id: Employee;

    @Column()
    state: string;

    @Column()
    hourly_rate: number;

    @Column()
    hours: number;
   
    @Column()
    total_payed: number;
}