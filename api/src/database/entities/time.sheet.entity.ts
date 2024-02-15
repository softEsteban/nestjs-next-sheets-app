import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';

@Entity({ name: 'sheet_times', schema: 'generic' })

export class TimeSheet {

    @PrimaryGeneratedColumn()
    sheet_id: number;

    @Column()
    sheet_state: string;

    @Column()
    sheet_hours: number;
    
    @Column()
    sheet_pay_rate: number;
   
    @Column()
    sheet_total_payed: number;
    
    @Column({ type: 'date' })
    sheet_check_date: Date;

    @ManyToOne(() => Employee, employee => employee.time_sheets)
    @JoinColumn({ name: 'employee_id' })
    employee: Employee;

}