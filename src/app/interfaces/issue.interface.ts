import { Dependency } from "./dependency.interface";
import { Ticket } from "./ticket.interface";

export interface Issue {
  id: number;

  description: string;

  code: string;

  enabled: boolean;

  dependency_id?: number;

  dependency?: Dependency[];

  ticket?: Ticket[];
}
