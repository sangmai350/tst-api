import { IsNotEmpty } from "class-validator";
import { Entity, ManyToOne } from "typeorm";
import { InOutcome } from "./InOutcome";
import { User } from "./User";

@Entity()
export class Income extends InOutcome {
  @IsNotEmpty()
  @ManyToOne(() => User, (user) => user.incomes)
  public personInCharge: User;

  public totalIncome: number;
}
