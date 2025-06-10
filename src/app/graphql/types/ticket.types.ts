import { ErrorResponse } from "@app/interfaces/error_response.interface";
import { Ticket } from "@app/interfaces/ticket.interface";

export interface TicketResult {
  createTicket: Ticket | ErrorResponse;
}
