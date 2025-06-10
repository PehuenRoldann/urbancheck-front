import { gql } from "graphql-request";

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
          its
          issue {
            id
            description
          }
          status_history {
            id
            author_id
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
          issue {
            id
            description
          }
          status_history {
            id
            author_id
          }
        }
      }
    }
  `;

  static readonly TicketStatusHistory = gql`
  query TicketStatusHistory ($id: String!) {
    ticketStatusHistory (id: $id) {
      
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
}
