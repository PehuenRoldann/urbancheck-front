import { gql } from "graphql-request";

export const LAZYSYNCUSER = gql`
  mutation LazySyncUser($input: LazySyncUserInput!) {
    lazySyncUser(input: $input) {
      ... on User {
        id
        authProviderId
        email
        dni
        firstName
        lastName
        birthDate
        postalCode
        street
        streetNumber
        roleId
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
