import { Observable } from "rxjs";
import { MarkerData } from "../models/markerData";
import { Ticket } from "./ticket.interface";
import { InjectionToken } from "@angular/core";
import { ErrorResponse } from "./error_response.interface";
import { TicketFilterInput } from "@app/graphql/types/ticket.types";

export interface TicketServiceInterface {
  //GetMarkers(): Promise<MarkerData[]>;
  markersData$: Observable<MarkerData[]>;
  ticketData$: Observable<Ticket | null>;
  ticketList$: Observable<Ticket[]>;
  ticketCounter$: Observable<number>;

  //GetTicketData(ticketId: string): Observable<Ticket>;

  AddTicket(
    description: string,
    issueId: number,
    longitud: number,
    latitud: number,
    ticketImgUrl: string,
  ): Promise<Ticket | ErrorResponse>;
  /**Actualiza el observable con los marcadores.*/
  UpdateMarkersData(): void;
  /** Actualiza el valor del ticekt seleccionado */
  UpdateTicketData(id: string): void;
  /** Updates the ticket list values */
  UpdateTicketList(filter?: TicketFilterInput): Promise<void>;
  UpdateTicketCounter(filter?: TicketFilterInput): Promise<void>;
}

// Crea el token de inyección
export const TICKET_SERVICE_INTERFACE_TOKEN =
  new InjectionToken<TicketServiceInterface>("ITicketDataService");
