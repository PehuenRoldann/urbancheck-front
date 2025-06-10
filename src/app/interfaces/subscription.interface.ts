import { Ticket } from "./ticket.interface";
import { User } from "./user.interface";

export interface Subscription {
  id: number;

  user_account?: User;

  ticket?: Ticket;

  its?: Date;

  dts?: Date;
}
