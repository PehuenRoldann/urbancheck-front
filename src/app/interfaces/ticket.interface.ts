import { Issue } from "./issue.interface";
import { PriorityHistory } from "./priority_history.entity";
import { StatusHistory } from "./status_history.interface";
import { Subscription } from "./subscription.interface";

export interface Ticket {
  id: string;

  description?: string;

  latitude?: number;

  longitude?: number;

  image_url?: string;

  issue_id?: number;

  issue?: Issue;

  its?: Date;

  uts?: Date;

  dts?: Date;

  priority_history?: PriorityHistory[];

  status_history?: StatusHistory[];

  subscription?: Subscription[];

  createdBy?: string;

  state?: string;
}


export function emptyTicket(): Ticket {
  const emptyTicket: Ticket = {
    id: '',
  
    // opcionales, pueden omitirse o definirse como:
    description: '',
    latitude: 0,
    longitude: 0,
    image_url: '',
    issue: undefined,
    its: undefined,
    uts: undefined,
    dts: undefined,
    priority_history: [],
    status_history: [],
    subscription: [],
    createdBy: '',
    state: '',
  };

  return emptyTicket;
  
}