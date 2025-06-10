import { Dependency } from "./dependency.interface";
import { User } from "./user.interface";

export interface WorksAt {
  id: number;

  user_id: string;

  dependency_id: number;

  started?: Date;

  ended?: Date;

  dependency?: Dependency;

  user_account?: User;
}
