import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity({ name: 'sheet_times', schema: 'generic' })

export class TimeSheet {

    @PrimaryGeneratedColumn()
    sheet_id: number;

    @OneToOne(() => Employee)
    @JoinColumn({ name: 'employee_id' })
    employee: Employee;

    @Column()
    state: string;

    @Column()
    hours: number;
   
    @Column()
    total_payed: number;

    @Column({ type: 'date' })
    check_date: Date;
}