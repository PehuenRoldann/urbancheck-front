import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterIssues',
})
export class FilterIssuesPipe implements PipeTransform {
  transform(issues: any[], searchTerm: string): any[] {
    if (!issues) return [];
    if (!searchTerm) return issues;

    const lowerSearch = searchTerm.toLowerCase();
    return issues.filter((issue) =>
      issue.description?.toLowerCase().includes(lowerSearch)
    );
  }
}
