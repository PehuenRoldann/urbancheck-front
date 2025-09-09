import { Injectable } from '@angular/core';
import { StatusHistoryQueries } from '@app/graphql/queries/status-history.queries';
import { TicketQueries } from '@app/graphql/queries/ticket.queries';
import { StatusHistory } from '@app/interfaces/status_history.interface';
import { TicketStatus } from '@app/interfaces/ticket_status.interface';
import { sleep } from '@app/utils/utils';
import { GraphQLClient } from 'graphql-request';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TicketSatusService {
  private ticketStatusSubject = new BehaviorSubject<TicketStatus[]>([]); // Markers info to draw markers
  public ticketStatus$ = this.ticketStatusSubject.asObservable();

  private statusHistorySubject = new BehaviorSubject<StatusHistory[]>([]);
  public statusHistory$ = this.statusHistorySubject.asObservable();

  private endpoint = environment.backendForFrontendUrl;

  constructor(private readonly keycloak: KeycloakService) {}

  private async generateGqlClient(): Promise<GraphQLClient> {
    const token = await this.keycloak.getToken();
    if (!token) throw new Error('No se pudo obtener el token.');

    const client = new GraphQLClient(this.endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return client;
  }

  public async UpdateTicketStatus(): Promise<void> {
    await sleep(1000); // DEBUG
    const client = await this.generateGqlClient();

    const response = await client.request<{ ticketStatus: TicketStatus[] }>(
      TicketQueries.TicketStatus
    );

    this.ticketStatusSubject.next(response.ticketStatus);
  }

  public async UpdateStatusHistoryByTicketId(ticketId: string): Promise<void> {
    await sleep(1000); // DEBUG
    const client = await this.generateGqlClient();

    const response = await client.request<{
      ticketStatusHistory: StatusHistory[];
    }>(StatusHistoryQueries.StatusHistoryByTicketId, { id: ticketId });

    this.statusHistorySubject.next(response.ticketStatusHistory);
  }
}
