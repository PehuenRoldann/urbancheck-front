import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KeycloakService } from 'keycloak-angular';
import { GraphQLClient } from 'graphql-request';
import { GraphqlUtilsService } from './graphql-utils.service';
import { ErrorResponse } from '@app/interfaces/error_response.interface';
import { SubscriptionsMutations } from '@app/graphql/mutations/subscriptions.mutations';
import { SubscriptionsQueries } from '@app/graphql/queries/subscription.queries';
import { Subscription } from '@app/interfaces/subscription.interface';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsService {
  private userSubscriptions = new BehaviorSubject<Subscription[]>([]);
  public userSubscriptions$ = this.userSubscriptions.asObservable();

  constructor(
    private keycloak: KeycloakService,
    private graphqlUtilsService: GraphqlUtilsService
  ) {}

  public async UpdateUserSubscriptions(active: boolean = false): Promise<void> {
    const client = await this.graphqlUtilsService.generateGqlClient();

    const userId = this.keycloak.getKeycloakInstance().tokenParsed?.sub;
    if (!userId) throw new Error('No se pudo obtener el ID del usuario.');

    const response = await client.request<{
      getSubscriptions: Subscription[];
    }>(SubscriptionsQueries.GET_SUBSCRIPTIONS, {
      input: {
        active: active,
      },
    });

    this.userSubscriptions.next(response.getSubscriptions);
  }

  public async SubscribeToTicket(
    ticketId: string
  ): Promise<{ code: number; message: string }> {
    const client = await this.graphqlUtilsService.generateGqlClient();

    try {
      const response = await client.request<{
        subscribe: Subscription;
      }>(SubscriptionsMutations.SUBSCRIBE, {
        input: {
          ticketId: ticketId,
        },
      });

      if (response.subscribe) {
        return {
          code: 200,
          message: 'Se ha realizado la suscripción con éxito.',
        };
      } else {
        return {
          code: 400,
          message: 'No se pudo realizar la suscripción.',
        };
      }
    } catch (error) {
      console.error('Error subscribing to ticket:', error);
      return { code: 500, message: 'Error al realizar la suscripción.' };
    }
  }

  public async UnsubscribeFromTicket(
    ticketId: string
  ): Promise<{ code: number; message: string }> {
    const client = await this.graphqlUtilsService.generateGqlClient();

    try {
      const response = await client.request<{
        unsubscribe: Subscription;
      }>(SubscriptionsMutations.UNSUBSCRIBE, {
        input: {
          ticketId: ticketId,
        },
      });
      if (response.unsubscribe) {
        return {
          code: 200,
          message: 'Se ha cancelado la suscripción con éxito.',
        };
      } else {
        return { code: 400, message: 'No se pudo cancelar la suscripción.' };
      }
    } catch (error) {
      console.error('Error unsubscribing from ticket:', error);
      return { code: 500, message: 'Error al cancelar la suscripción.' };
    }
  }
}
