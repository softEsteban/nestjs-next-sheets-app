import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity( {name: 'profiles', schema:'generic'})

export class Profile {

    @PrimaryGeneratedColumn()
    profile_id: number;

    @Column()
    profile_name: string;

    @Column({ type: 'jsonb' })
    profile_config:  Record<string, any>;
   
}