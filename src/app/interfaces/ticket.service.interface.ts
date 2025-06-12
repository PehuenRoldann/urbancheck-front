import { Observable } from "rxjs";
import { MarkerData } from "../models/markerData";
import { Ticket } from "./ticket.interface";
import { InjectionToken } from "@angular/core";
import { ErrorResponse } from "./error_response.interface";

export interface TicketServiceInterface {
  //GetMarkers(): Promise<MarkerData[]>;
  markersData$: Observable<MarkerData[]>;
  ticketData$: Observable<Ticket | null>;

  //GetTicketData(ticketId: string): Observable<Ticket>;

  AddTicket(
    description: string,
    dependency: number,
    longitud: number,
    latitud: number,
    ticketImgUrl: string,
  ): Promise<Ticket | ErrorResponse>;
  /**Actualiza el observable con los marcadores.*/
  UpdateMarkersData(): void;
  /** Actualiza el valor del ticekt seleccionado */
  UpdateTicketData(id: string): void;
}

// Crea el token de inyección
export const TICKET_SERVICE_INTERFACE_TOKEN =
  new InjectionToken<TicketServiceInterface>("ITicketDataService");
