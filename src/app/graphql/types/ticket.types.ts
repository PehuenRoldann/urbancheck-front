import { ErrorResponse } from "@app/interfaces/error_response.interface";
import { Ticket } from "@app/interfaces/ticket.interface";
import { TicketStatus } from "@app/interfaces/ticket_status.interface";

export interface TicketResult {
  createTicket: Ticket | ErrorResponse;
}


export class TicketFilterInput {
  
  user_id?: string;
  status_id?: number;
  priority_id?: number;
  dependency_id?: number;
  page?: number;
  limit?: number;
}
