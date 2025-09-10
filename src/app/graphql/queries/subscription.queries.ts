import { gql } from 'graphql-request';

export class SubscriptionsQueries {
  static readonly GET_SUBSCRIPTIONS = gql`
    query GetSubscriptions($input: GetSubscriptionsInput!) {
      getSubscriptions(input: $input) {
        ... on Subscription {
          id
          dts
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
}
