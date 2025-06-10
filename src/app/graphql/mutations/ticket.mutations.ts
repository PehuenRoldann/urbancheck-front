import { gql } from "graphql-request";

export class TicketMutations {
  static readonly CREATE_TICKET = gql`
    mutation CreateTicket($input: CreateTicketInput!) {
      createTicket(input: $input) {
        ... on Ticket {
          id
          description
          latitude
          longitude
          timestamp
          image_url
        }
      }
    }
  `;
}
