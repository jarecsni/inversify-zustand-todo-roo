import { Identifiable } from "./Store";

export interface Todo extends Identifiable {
  text: string;
  completed: boolean;
  createdAt: Date;
}
