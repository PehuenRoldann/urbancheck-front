import { StatusHistory } from "./status_history.interface";

export interface TicketStatus {
  id: number;

  description: string;

  status_history?: StatusHistory[];
}
