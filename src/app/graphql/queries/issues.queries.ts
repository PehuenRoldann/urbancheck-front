import { gql } from 'graphql-request';

export class IssueQueries {
  static readonly findAllIssues = gql`
    query FindAllIssues {
      findAllIssues {
        id
        description
        code
        enabled
        dependency_id
      }
    }
  `;
}
