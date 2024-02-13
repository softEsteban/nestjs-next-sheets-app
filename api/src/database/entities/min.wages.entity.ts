import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'minimum_wages', schema: 'generic' })

export class MinWages {

    @PrimaryGeneratedColumn()
    wage_id: number;

    @Column()
    wage_name: string;

    @Column()
    wage_value: number;
}