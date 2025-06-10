import { gql } from "graphql-request";
export class UserMutations {
  static readonly LAZYSYNCUSER = gql`
    mutation LazySyncUser($input: LazySyncUserInput!) {
      lazySyncUser(input: $input) {
        ... on User {
          id
          auth_provider_id
          email
          dni
          first_name
          last_name
          birth_date
          postal_code
          street
          street_number
          role {
            id
            description
          }
          its
          uts
          dts
        }

        ... on ErrorResponse {
          message
          code
          path
        }
      }
    }
  `;

}
