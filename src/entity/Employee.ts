import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 100)
  name: string;

  @Column()
  dob: Date;

  @Column()
  @Length(4, 100)
  address: string;

  @Column()
  phone: Number;

  @Column()
  joinDate: Date;

  @Column()
  salary: Number;

  @Column()
  isActive: Boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  totalSalary: Number;
}
