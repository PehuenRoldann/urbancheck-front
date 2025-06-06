import { Observable } from "rxjs";
import { MarkerData } from "../models/markerData";
import { Ticket } from "../models/ticket";

export interface TicketDataService {
  GetMarkers(): Promise<MarkerData[]>;
  GetTicketData(ticketId: string): Observable<Ticket | undefined>;
}
