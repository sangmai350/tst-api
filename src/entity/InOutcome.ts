import { IsNotEmpty } from "class-validator";
import {
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

export abstract class InOutcome {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public value: number;

    @Column()
    public date: Date;

    @Column()
    @IsNotEmpty()
    public description: string;

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;
}
