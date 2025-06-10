import { PriorityHistory } from "./priority_history.entity";
import { Role } from "./role.interface";
import { StatusHistory } from "./status_history.interface";
import { Subscription } from "./subscription.interface";
import { UserPenalty } from "./user_penalty.interface";
import { WorksAt } from "./works_at.interface";

export interface User {
  id: string;

  auth_provider_id: string;

  dni: string;

  email: string;

  email_alt?: string;

  first_name: string;

  last_name: string;

  birth_date: Date;

  postal_code?: number;

  street?: string;

  street_number?: number;

  is_resident?: boolean;

  role_id: number;

  its?: Date;

  uts?: Date;

  dts?: Date;

  role?: Role;

  priority_history?: PriorityHistory[];

  status_history?: StatusHistory[];

  subscription?: Subscription[];

  user_penalty?: UserPenalty[];

  works_at?: WorksAt[];
}
