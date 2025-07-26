import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TodoApp } from "./TodoApp";
import { ContainerProvider } from "@/hooks/useContainer";
import {
  createTestContainer,
  getMockTodoService,
  getMockLoggingService,
} from "@/test-utils/test-container";

describe("TodoApp with IOC", () => {
  let testContainer: ReturnType<typeof createTestContainer>;

  beforeEach(() => {
    testContainer = createTestContainer();
  });

  const renderWithContainer = (component: React.ReactElement) => {
    return render(
      <ContainerProvider container={testContainer}>
        {component}
      </ContainerProvider>
    );
  };

  describe("Dependency Injection Integration", () => {
    it("should use injected mock TodoService", async () => {
      const mockTodoService = getMockTodoService(testContainer);

      // Pre-populate with mock data using the service
      mockTodoService.addTodo("Mock Todo 1");
      mockTodoService.addTodo("Mock Todo 2");

      // Toggle the second todo to completed
      const todos = mockTodoService.getTodos();
      if (todos.length > 1) {
        mockTodoService.toggleTodo(todos[1].id);
      }

      renderWithContainer(<TodoApp />);

      // Verify mock todos are displayed
      await waitFor(() => {
        expect(screen.getByText("Mock Todo 1")).toBeInTheDocument();
        expect(screen.getByText("Mock Todo 2")).toBeInTheDocument();
        expect(screen.getByText("1 of 2 completed")).toBeInTheDocument();
      });
    });

    it("should add todos through injected service", async () => {
      const mockTodoService = getMockTodoService(testContainer);
      const mockLoggingService = getMockLoggingService(testContainer);

      renderWithContainer(<TodoApp />);

      const input = screen.getByPlaceholderText("What needs to be done?");
      const addButton = screen.getByText("Add Todo");

      fireEvent.change(input, { target: { value: "New test todo" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("New test todo")).toBeInTheDocument();
      });

      // Verify service was called
      const todos = mockTodoService.getTodos();
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe("New test todo");

      // Verify logging service captured the action
      const logs = mockLoggingService.logs;
      expect(
        logs.some((log) => log.level === "info" && log.message === "Todo added")
      ).toBe(true);
    });

    it("should toggle todos through injected service", async () => {
      const mockTodoService = getMockTodoService(testContainer);

      // Add a todo first
      mockTodoService.addTodo("Test todo to toggle");

      renderWithContainer(<TodoApp />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });

      // Verify the todo is completed in the service
      const todos = mockTodoService.getTodos();
      expect(todos[0].completed).toBe(true);
    });

    it("should remove todos through injected service", async () => {
      const mockTodoService = getMockTodoService(testContainer);
      const mockLoggingService = getMockLoggingService(testContainer);

      // Add a todo first
      mockTodoService.addTodo("Test todo to remove");

      renderWithContainer(<TodoApp />);

      expect(screen.getByText("Test todo to remove")).toBeInTheDocument();

      const removeButton = screen.getByText("Remove");
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(
          screen.queryByText("Test todo to remove")
        ).not.toBeInTheDocument();
      });

      // Verify service was called
      const todos = mockTodoService.getTodos();
      expect(todos).toHaveLength(0);

      // Verify logging service captured the removal
      const logs = mockLoggingService.logs;
      expect(
        logs.some(
          (log) => log.level === "info" && log.message === "Todo removed"
        )
      ).toBe(true);
    });

    it("should show empty state when no todos", () => {
      renderWithContainer(<TodoApp />);

      expect(
        screen.getByText("No todos yet. Add one above to get started!")
      ).toBeInTheDocument();
      expect(screen.getByText("0 of 0 completed")).toBeInTheDocument();
    });
  });

  describe("Service Isolation Testing", () => {
    it("should work with completely isolated mock services", () => {
      // This test demonstrates that components are completely isolated from real services
      const mockTodoService = getMockTodoService(testContainer);
      const mockLoggingService = getMockLoggingService(testContainer);

      // Mock services start clean
      expect(mockTodoService.getTodos()).toHaveLength(0);
      expect(mockLoggingService.logs).toHaveLength(0);

      renderWithContainer(<TodoApp />);

      // We can verify the component uses ONLY the mock services
      expect(screen.getByText("Todo App")).toBeInTheDocument();
      expect(screen.getByText("0 of 0 completed")).toBeInTheDocument();
    });
  });
});
