import { Issue } from "./issue.interface";
import { User } from "./user.interface";

export interface Dependency {
  id: number;
  name: string; // Based on the MunicipalDependencies enum
  is_operationg: boolean;
  problematica?: Issue[];
  works_at?: User[];
}
