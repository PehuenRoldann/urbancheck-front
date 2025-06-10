import { gql } from "graphql-request";

export class UserQueries {
    
    static readonly TicketAuthor = gql`
        query TicketAuthor ($id: String!) {
            ticketAuthor(id: $id) {
                ... on User {
                    id
                    first_name
                    last_name
                    email
                    dni
                }
                
                ... on ErrorResponse {
                    code
                    message
                    path
                }
            }
        }
    `;

    static readonly FindOneByToken = gql`
    query FindOneByToken {
      findOneByToken {
        ... on User {
          id
          first_name
          email
          dni
          last_name
          birth_date
          postal_code
          street
          street_number
        }

        ... on ErrorResponse {
          code
          message
          path
        }
      }
    }
  `;
}