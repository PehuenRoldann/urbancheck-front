import { PriorityHistory } from "./priority_history.entity";

export interface Priority {
  id: number;

  description: string;

  priority_history?: PriorityHistory[];
}
