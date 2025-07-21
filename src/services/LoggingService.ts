import { injectable } from "inversify";
import { ILoggingService } from "@/types";

@injectable()
export class LoggingService implements ILoggingService {
  info(message: string, data?: any): void {
    console.log(`[INFO] ${message}`, data ? data : "");
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data ? data : "");
  }

  error(message: string, error?: Error): void {
    console.error(`[ERROR] ${message}`, error ? error : "");
  }
}
