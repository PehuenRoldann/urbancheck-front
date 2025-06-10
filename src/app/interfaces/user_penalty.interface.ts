import { PenaltyType } from "./penalty_type.interface";
import { User } from "./user.interface";

export interface UserPenalty {
  id: number;

  penalty_type_id?: number;

  date: Date;

  user_id?: string;

  penalty_type?: PenaltyType;

  user_account?: User;
}
