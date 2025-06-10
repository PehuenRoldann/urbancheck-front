import { UserPenalty } from "./user_penalty.interface";

export interface PenaltyType {
  id: number;

  code: string;

  description: string;

  user_penalty?: UserPenalty[];
}
