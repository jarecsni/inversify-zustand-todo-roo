import { LoggingService } from "./LoggingService";

describe("LoggingService", () => {
  let loggingService: LoggingService;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    loggingService = new LoggingService();
    consoleSpy = jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "warn").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("info", () => {
    it("should log info messages", () => {
      loggingService.info("Test message");
      expect(console.log).toHaveBeenCalledWith("[INFO] Test message", "");
    });

    it("should log info messages with data", () => {
      const data = { key: "value" };
      loggingService.info("Test message", data);
      expect(console.log).toHaveBeenCalledWith("[INFO] Test message", data);
    });
  });

  describe("warn", () => {
    it("should log warning messages", () => {
      loggingService.warn("Warning message");
      expect(console.warn).toHaveBeenCalledWith("[WARN] Warning message", "");
    });

    it("should log warning messages with data", () => {
      const data = { issue: "something" };
      loggingService.warn("Warning message", data);
      expect(console.warn).toHaveBeenCalledWith("[WARN] Warning message", data);
    });
  });

  describe("error", () => {
    it("should log error messages", () => {
      loggingService.error("Error message");
      expect(console.error).toHaveBeenCalledWith("[ERROR] Error message", "");
    });

    it("should log error messages with error object", () => {
      const error = new Error("Test error");
      loggingService.error("Error message", error);
      expect(console.error).toHaveBeenCalledWith(
        "[ERROR] Error message",
        error
      );
    });
  });
});
