import { injectable } from "inversify";
import { ILoggingService } from "@/types";

@injectable()
export class MockLoggingService implements ILoggingService {
  public logs: Array<{ level: string; message: string; data?: any }> = [];

  info(message: string, data?: any): void {
    this.logs.push({ level: "info", message, data });
  }

  warn(message: string, data?: any): void {
    this.logs.push({ level: "warn", message, data });
  }

  error(message: string, error?: Error): void {
    this.logs.push({ level: "error", message, data: error });
  }

  clear(): void {
    this.logs = [];
  }
}
