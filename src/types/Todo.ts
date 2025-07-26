import { Identifiable } from "@/store/MasterStore";

export interface Todo extends Identifiable {
  text: string;
  completed: boolean;
  createdAt: Date;
}
