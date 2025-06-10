import { Priority } from "./priority.interface";
import { Ticket } from "./ticket.interface";
import { User } from "./user.interface";

export interface PriorityHistory {
  id: number;

  author_id?: string;

  ticket_id?: string;

  priority?: Priority;

  user_account?: User;

  ticket?: Ticket;

  its?: Date;
}
