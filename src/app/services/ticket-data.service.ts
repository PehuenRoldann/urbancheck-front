import { Injectable } from "@angular/core";
import { GraphQLClient } from "graphql-request";
import { TicketMutations } from "@app/graphql/mutations/ticket.mutations";
import { Ticket } from "@app/interfaces/ticket.interface";
import { KeycloakService } from "keycloak-angular";
import { MarkerData } from "@app/models/markerData";
import { BehaviorSubject, Observable } from "rxjs";
import { TicketDataService } from "@app/interfaces/ticket-data-service";
import { ErrorResponse } from "@app/interfaces/error_response.interface";
import { TicketQueries } from "@app/graphql/queries/ticket.queries";
import { TicketServiceInterface } from "@app/interfaces/ticket.service.interface";
import { User } from "@app/interfaces/user.interface";
import { UserQueries } from "@app/graphql/queries/user.queries";
import { TicketResult } from "@app/graphql/types/ticket.types";
import { UserResponse } from "@app/graphql/types/user.types";
import { StatusHistory } from "@app/interfaces/status_history.interface";
import { environment } from "src/environments/environment";


@Injectable({ providedIn: "root" })
export class TicketService implements TicketServiceInterface {
  private markersDataSubject = new BehaviorSubject<MarkerData[]>([]);
  public markersData$ = this.markersDataSubject.asObservable();

  private ticketDataSubject = new BehaviorSubject<Ticket | null>(null);
  public ticketData$ = this.ticketDataSubject.asObservable();

  private endpoint = environment.backendForFrontendUrl; // adaptá según tu backend

  constructor(private readonly keycloak: KeycloakService) {}

  async AddTicket(
    description: string,
    dependencyId: number,
    longitud: number,
    latitud: number,
  ): Promise<Ticket | ErrorResponse> {
    const token = await this.keycloak.getToken();

    const client = new GraphQLClient(this.endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const variables = {
      input: {
        description,
        issueId: dependencyId,
        longitude: longitud,
        latitude: latitud,
      },
    };

    const response = await client.request<TicketResult>(
      TicketMutations.CREATE_TICKET,
      variables,
    );

    const result = response.createTicket;

    if ("id" in result && "description" in result) {
      const ticket: Ticket = result;
      return ticket;
    }

    const error: ErrorResponse = result as ErrorResponse;
    console.error(error.message);
    return error;
  }

  async UpdateMarkersData(): Promise<void> {
    const token = await this.keycloak.getToken();
    if (!token) throw new Error("No se pudo obtener el token.");

    const client = new GraphQLClient(this.endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await client.request<{ findTickets: Ticket[] }>(
      TicketQueries.FindTickets,
    );


    const markerData: MarkerData[] = []
    response.findTickets.forEach((element: Ticket) => {
      markerData.push({
        id: element.id,
        latitude: element.latitude!,
        longitude: element.longitude!
      })
    });

    this.markersDataSubject.next(markerData);
  }

  async UpdateTicketData(id: string): Promise<void> {
    const token = await this.keycloak.getToken();
    if (!token) throw new Error("No se pudo obtener el token.");

    const client = new GraphQLClient(this.endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseTicket = await client.request<{ ticket: Ticket }>(TicketQueries.Ticket, {
      id: id,
    });
    
    const ticket = responseTicket.ticket;

    const responseUser = await client.request<{ticketAuthor: UserResponse}>(UserQueries.TicketAuthor,
      {
        id: ticket.id,
      }
    );

    const authorResult = responseUser.ticketAuthor;

    if ('email' in authorResult) {
      const user = authorResult as unknown as User;

      ticket.createdBy = user.first_name + ' ' + user.last_name;
      
    } else {
      const error = authorResult as unknown as  ErrorResponse;
      console.error("Es un ErrorResponse:", error.message);
    }

    const StatusHistory = await client.request<{ticketStatusHistory: StatusHistory[]}>(TicketQueries.TicketStatusHistory,
      {
        id: ticket.id
      }
    );


    ticket.state = StatusHistory.ticketStatusHistory[0].ticket_status?.description;

    this.ticketDataSubject.next(ticket);
  }
}
