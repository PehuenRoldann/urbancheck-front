import { Injectable } from '@angular/core';
import { GraphQLClient } from 'graphql-request';
import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GraphqlUtilsService {

  private endpoint = environment.backendForFrontendUrl;

  constructor(private readonly keycloak: KeycloakService) {
  }

  public async generateGqlClient(): Promise<GraphQLClient> {
    const token = await this.keycloak.getToken();
    if (!token) throw new Error("No se pudo obtener el token.");

    const client = new GraphQLClient(this.endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return client;
  }
}
