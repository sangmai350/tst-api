import * as bcrypt from "bcryptjs";
import { IsNotEmpty, Length } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Income } from "./Income";
import { Outcome } from "./Outcome";

@Entity()
@Unique(["username"])
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @Length(4, 20)
  public username: string;

  @Column()
  @Length(4, 100)
  public password: string;

  @Column()
  @IsNotEmpty()
  public role: string;

  @OneToMany((type) => Income, (income) => income.personInCharge)
  public incomes: Income[];

  @OneToMany((type) => Outcome, (outcome) => outcome.personInCharge)
  public outcomes: Outcome[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  public hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
