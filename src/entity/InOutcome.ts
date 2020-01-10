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

@Entity()
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

    @ManyToOne(type => User, user => user.income)
    personInCharge: User;

}

@Entity()
export class Outcome extends InOutcome {

    @ManyToOne(type => User, user => user.oucome)
    personInCharge: User;

}

