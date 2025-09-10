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
}
