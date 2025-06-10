import { Ticket } from "./ticket.interface";
import { TicketStatus } from "./ticket_status.interface";
import { User } from "./user.interface";

export interface StatusHistory {
  id: number;

  its: Date;

  author_id: string;

  ticket_id: string;

  status_id: number;

  user_account?: User;

  ticket?: Ticket;

  ticket_status?: TicketStatus;
}
