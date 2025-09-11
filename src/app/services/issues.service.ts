import { Injectable } from '@angular/core';
import { GraphqlUtilsService } from './graphql-utils.service';
import { Issue } from '@app/interfaces/issue.interface';
import { BehaviorSubject } from 'rxjs';
import { IssueQueries } from '@app/graphql/queries/issues.queries';

@Injectable({ providedIn: 'root' })
export class IssuesService {
  private issuesListSubject = new BehaviorSubject<Issue[]>([]); // Issues list
  public issuesList$ = this.issuesListSubject.asObservable();

  constructor(private graphqlUtilsService: GraphqlUtilsService) {}

  async fetchIssues(): Promise<void> {
    const client = await this.graphqlUtilsService.generateGqlClient();
    const data = await client.request<{ findAllIssues: Issue[] }>(
      IssueQueries.findAllIssues
    );

    this.issuesListSubject.next(data.findAllIssues ?? []);
  }

  async updateIssuesData(): Promise<void> {
    await this.fetchIssues();
  }
}
