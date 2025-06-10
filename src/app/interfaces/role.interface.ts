import { User } from "./user.interface";

export interface Role {
  id: number;

  description: string;

  user_account?: User[];
}
