import { Injectable } from "@angular/core";
import { GraphQLClient } from "graphql-request";
import { TicketMutations } from "@app/graphql/mutations/ticket.mutations";
import { Ticket } from "@app/interfaces/ticket.interface";
import { KeycloakService } from "keycloak-angular";
import { MarkerData } from "@app/models/markerData";
import { BehaviorSubject, delay, Observable } from "rxjs";
import { ErrorResponse } from "@app/interfaces/error_response.interface";
import { TicketQueries } from "@app/graphql/queries/ticket.queries";
import { TicketServiceInterface } from "@app/interfaces/ticket.service.interface";
import { User } from "@app/interfaces/user.interface";
import { UserQueries } from "@app/graphql/queries/user.queries";
import { TicketFilterInput, TicketResult } from "@app/graphql/types/ticket.types";
import { UserResponse } from "@app/graphql/types/user.types";
import { StatusHistory } from "@app/interfaces/status_history.interface";
import { environment } from "src/environments/environment";
import { sleep } from "@app/utils/utils";

interface CreateTicketInput {
  description: string;
	latitude: number;
  longitude: number;
	statusId: number;
	priorityId: number;
	issueId: number;
	imageUrl: string | null;
}



@Injectable({ providedIn: "root" })
export class TicketService implements TicketServiceInterface {
  private markersDataSubject = new BehaviorSubject<MarkerData[]>([]); // Markers info to draw markers
  public markersData$ = this.markersDataSubject.asObservable();

  private ticketDataSubject = new BehaviorSubject<Ticket | null>(null); // Ticket data to display when a marker is clicked
  public ticketData$ = this.ticketDataSubject.asObservable();

  private ticketListSubject = new BehaviorSubject<Ticket[]>([]); // Markers data to display as a list
  public ticketList$ = this.ticketListSubject.asObservable();

  private ticketCounterSubject = new BehaviorSubject<number>(0);
  public ticketCounter$ = this.ticketCounterSubject.asObservable();

  private endpoint = environment.backendForFrontendUrl; // adaptá según tu backend

  constructor(private readonly keycloak: KeycloakService) {}



  private async generateGqlClient(): Promise<GraphQLClient> {

    const token = await this.keycloak.getToken();
    if (!token) throw new Error("No se pudo obtener el token.");

    const client = new GraphQLClient(this.endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return client;
  }

  async AddTicket(
    description: string,
    issueId: number,
    longitud: number,
    latitud: number,
    ticketImgUrl: string,
  ): Promise<Ticket | ErrorResponse> {

    const client = await this.generateGqlClient();

    const input: CreateTicketInput = {
      description: description,
      latitude: latitud,
      longitude: longitud,
      statusId: 1, // Estado inicial "Abierto"
      priorityId: 1, // Prioridad inicial "Baja"
      issueId: issueId, // Asumimos que issueId es un número válido
      imageUrl: ticketImgUrl ?? null,
    };

    const variables = { input: input };
    console.log("DEBUG - Variables para CreateTicket:", variables);
    debugger;


    const response = await client.request<TicketResult>(
      TicketMutations.CREATE_TICKET,
      variables,
    );

    console.log("DEBUG - Response de CreateTicket:", response);
    debugger;

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

    const client = await this.generateGqlClient();

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

    const client = await this.generateGqlClient();

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


  async UpdateTicketList(filter?: TicketFilterInput): Promise<void> {

    await sleep(1000); // DEBUG

    const client = await this.generateGqlClient();

    const variables = {
      filter: filter || {}
    }

    const response = await client.request<{ findTickets: Ticket[] }>(
      TicketQueries.TicketListToShow,
      variables
    );

    console.log('DEBUG Update Tickets List: ');
    console.log(response.findTickets);

    this.ticketListSubject.next(response.findTickets);

  }

  async UpdateTicketCounter(filter?: TicketFilterInput): Promise<void> {
    await sleep(1000); // DEBUG

    const client = await this.generateGqlClient();

    const variables = {
      filter: filter || {}
    }

    const response = await client.request<{ countTickets: number }>(
      TicketQueries.CountTickets,
      variables
    );

    console.log('DEBUG Update Tickets Counter: ');
    console.log(response.countTickets);

    this.ticketCounterSubject.next(response.countTickets);
  }

}
