import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { KeycloakService } from "keycloak-angular";
import { GraphQLClient } from "graphql-request";
import { UserMutations } from "@app/graphql/mutations/users.mutations";
import { User } from "@app/interfaces/user.interface";
import { ErrorResponse } from "@app/interfaces/error_response.interface";
import { UserQueries } from "@app/graphql/queries/user.queries";

// Define el modelo de datos para UserDTO
export interface UserDTO {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  direccion: string;
  dni: string;
  uuid: string;
  fechaNacimiento: string; // Formato "yyyy-mm-dd"
}

@Injectable({
  providedIn: "root",
})
export class UserServiceService {

  private endpoint = environment.backendForFrontendUrl;

  constructor(private keycloak: KeycloakService) {}

  async syncUserToBackend(): Promise<User | ErrorResponse> {
    const token = await this.keycloak.getToken();
    const userProfile = await this.keycloak.loadUserProfile();

    const client = new GraphQLClient(this.endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await client.request<{ UserResponse: User | ErrorResponse }>(
      UserMutations.LAZYSYNCUSER,
      {
        input: {
          auth_provider_id: userProfile.id,
        },
      },
    );

    return data.UserResponse;
  }

  async getUserData(): Promise<User> {
    const token = await this.keycloak.getToken();
    const userProfile = await this.keycloak.loadUserProfile();

    const client = new GraphQLClient(this.endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await client.request<{ findOneByToken: User | ErrorResponse }>(
      UserQueries.FindOneByToken,
    );

    return data.findOneByToken as unknown as User;
  }
}
