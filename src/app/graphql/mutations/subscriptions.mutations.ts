import { gql } from 'graphql-request';

export class SubscriptionsMutations {
  static readonly SUBSCRIBE = gql`
    mutation Subscribe($input: CreateSubscriptionInput!) {
      subscribe(input: $input) {
        ... on Subscription {
          id
          user_account {
            id
            first_name
            last_name
          }

          ticket {
            id
            description
          }
        }
      }
    }
  `;

  static readonly UNSUBSCRIBE = gql`
    mutation Unsubscribe($input: DeleteSubscriptionInput!) {
      unsubscribe(input: $input) {
        ... on Subscription {
          id
          user_account {
            id
            first_name
            last_name
          }
          ticket {
            id
            description
          }
          dts
        }
      }
    }
  `;
}
