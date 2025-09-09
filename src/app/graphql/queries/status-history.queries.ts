import { gql } from 'graphql-request';

export class StatusHistoryQueries {
  static readonly StatusHistoryByTicketId = gql`
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
            role_id
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
