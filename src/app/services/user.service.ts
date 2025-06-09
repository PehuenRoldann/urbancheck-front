import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { GraphQLClient } from "graphql-request";
import { User } from "@app/interfaces/user.interface";
import { ErrorResponse } from "@app/interfaces/error_response.interface";
import { LAZYSYNCUSER } from "@app/graphql/mutations/users.mutations";

@Injectable({ providedIn: "root" })
export class UserService {
  private endpoint = "http://localhost:3000/graphql/"; // tu URL real

  constructor(private keycloak: KeycloakService) {}

  async syncUserToBackend(): Promise<User | ErrorResponse> {
    const token = await this.keycloak.getToken();
    const userProfile = await this.keycloak.loadUserProfile();

    console.log("DEBUG >> TOKEN");
    console.log(token);

    console.log("DEBUG >> USERPROFILE");
    console.log(userProfile);

    const client = new GraphQLClient(this.endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await client.request<{ lazySyncUser: User | ErrorResponse }>(
      LAZYSYNCUSER,
      {
        input: {
          auth_provider_id: userProfile.id,
        },
      },
    );

    console.log("DEBUG >> DATA");
    console.log(data);

    return data.lazySyncUser;
  }
}
