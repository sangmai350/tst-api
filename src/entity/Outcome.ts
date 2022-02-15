import { IsNotEmpty } from "class-validator";
import { Entity, ManyToOne } from "typeorm";
import { InOutcome } from "./InOutcome";
import { User } from "./User";

@Entity()
export class Outcome extends InOutcome {
  @IsNotEmpty()
  @ManyToOne((type) => User, (user) => user.outcomes)
  public personInCharge: User;

  public totalOutcome: number;
}
