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

  static readonly UPDATE_TICKET = gql`
    mutation UpdateTicket($updateTicketInput: UpdateTicketInput!) {
      updateTicket(updateTicketInput: $updateTicketInput) {
        ... on Ticket {
          id
          description
          scheduled_resolution_at
          current_status {
            id
            description
          }
          current_priority {
            id
            description
          }
        }
      }
    }
  `;
}

