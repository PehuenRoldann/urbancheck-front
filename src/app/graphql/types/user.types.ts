import { User } from "@app/interfaces/user.interface";
import { ErrorResponse } from "@app/interfaces/error_response.interface";

export type LazySyncUserResponse = {
  lazySyncUser: User | ErrorResponse;
};

export interface UserResponse {
  ticketAuthor: User | ErrorResponse;
}