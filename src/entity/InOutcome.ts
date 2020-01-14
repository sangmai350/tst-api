import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { User } from "./User"

export abstract class InOutcome {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: Number;

    @Column()
    date: Date;


    @Column()
    @IsNotEmpty()
    description: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}


@Entity()
export class Income extends InOutcome {
    @IsNotEmpty()
    @ManyToOne(type => User, user => user.incomes)
    personInCharge: User;

    @Column()
    @IsNotEmpty()
    totalIncome: Number
}

@Entity()
export class Outcome extends InOutcome {
    @IsNotEmpty()
    @ManyToOne(type => User, user => user.oucomes)
    personInCharge: User;

    @Column()
    @IsNotEmpty()
    totalOutcome: Number

}

