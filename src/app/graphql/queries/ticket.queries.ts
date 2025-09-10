import { gql } from 'graphql-request';

export class TicketQueries {
  static readonly Ticket = gql`
    query Ticket($id: String!) {
      ticket(id: $id) {
        ... on Ticket {
          id
          description
          latitude
          longitude
          timestamp
          image_url
          current_status {
            id
            description
          }
          current_priority {
            id
            description
          }
          scheduled_resolution_at
          its
          issue {
            id
            description
          }
          status_history {
            id
            author_id
          }
          author {
            id
            last_name
            first_name
          }
        }
      }
    }
  `;

  static readonly FindTickets = gql`
    query findTickets($filter: TicketFilterInput) {
      findTickets(filter: $filter) {
        ... on Ticket {
          id
          description
          latitude
          longitude
          timestamp
          image_url
          its
          issue {
            id
            description
            dependency_id
          }
          status_history {
            id
            author_id
            status_id
          }
        }
      }
    }
  `;

  static readonly TicketStatusHistory = gql`
    query TicketStatusHistory($id: String!) {
      ticketStatusHistory(id: $id) {
        ... on StatusHistory {
          id
          its
          author_id
          ticket_id
          status_id
          user_account {
            id
            first_name
            last_name
            dni
          }

          ticket_status {
            id
            description
          }
        }
      }
    }
  `;

  static readonly TicketStatus = gql`
    query TicketStatus {
      ticketStatus {
        ... on TicketStatus {
          id
          description
        }
        ... on ErrorResponse {
          message
          code
          path
        }
      }
    }
  `;

  static readonly TicketListToShow = gql`
    query TicketListToShow($filter: TicketFilterInput) {
      findTickets(filter: $filter) {
        ... on Ticket {
          id
          its
          author {
            id
            first_name
            last_name
          }
          current_status {
            id
            description
          }
          dependency {
            id
            name
          }
        }
      }
    }
  `;

  static readonly CountTickets = gql`
    query CountTickets($filter: TicketFilterInput) {
      countTickets(filter: $filter)
    }
  `;
}
