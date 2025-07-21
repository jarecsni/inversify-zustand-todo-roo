# React Todo App with Inversify DI & Zustand

A modern todo application showcasing dependency injection patterns in React using InversifyJS and Zustand for state management. This project demonstrates clean architecture principles, testability through IOC, and modern React development practices.

## 🏗️ Architecture

This application follows a service-oriented architecture with dependency injection:

- **Components** → Inject and use services only
- **Services** → Business logic with `@Injectable` decorators
- **Store** → Zustand for centralized state management
- **Container** → InversifyJS for dependency injection
- **Tests** → Mock services through IOC container swapping

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architectural documentation.

## 🚀 Features

- ✅ **Add/Remove/Toggle Todos** - Full CRUD functionality
- 🔧 **Dependency Injection** - InversifyJS with `@Injectable` decorators
- 🏪 **State Management** - Zustand store accessed through services
- 🧪 **Comprehensive Testing** - Jest + RTL with IOC mock swapping
- 📝 **TypeScript** - Full type safety with strict mode
- ⚡ **Hot Module Replacement** - Webpack dev server
- 📦 **Modern Build** - Latest Webpack 5 with optimization

## 🛠️ Technology Stack

- **React** 18.2+ with TypeScript 5.3+
- **InversifyJS** 6.0+ for dependency injection
- **Zustand** 4.4+ for state management
- **Webpack** 5.89+ for bundling
- **Jest** 29.7+ with React Testing Library 14.1+

## 📁 Project Structure

```
src/
├── components/          # React components with DI
├── services/           # @Injectable business logic
├── store/             # Zustand state management
├── container/         # DI container configuration
├── hooks/             # Custom React hooks
├── types/             # TypeScript interfaces
├── test-utils/        # Testing utilities & mocks
└── *.test.ts         # Tests colocated with source
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Development Server

The app runs on `http://localhost:3000` with hot module replacement enabled.

## 🧪 Testing Philosophy

This project showcases the power of dependency injection for testing:

### IOC Testing Benefits

```typescript
// Create test container with mock services
const testContainer = createTestContainer();
const mockTodoService = getMockTodoService(testContainer);

// Pre-populate with test data
mockTodoService.setTodos([
  /* test todos */
]);

// Test with complete service isolation
render(
  <ContainerProvider container={testContainer}>
    <TodoApp />
  </ContainerProvider>
);
```

### Test Types

- **Unit Tests** - Individual service testing
- **Integration Tests** - Component + service interaction
- **IOC Tests** - Mock service injection verification

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🔧 Development

### Adding New Services

1. Create service with `@Injectable` decorator:

```typescript
@injectable()
export class NewService implements INewService {
  constructor(@inject(TYPES.LoggingService) private logger: ILoggingService) {}
}
```

2. Add service identifier:

```typescript
export const TYPES = {
  NewService: Symbol.for("NewService"),
  // ...existing
};
```

3. Register in container:

```typescript
container.bind<INewService>(TYPES.NewService).to(NewService);
```

4. Create mock for testing:

```typescript
@injectable()
export class MockNewService implements INewService {
  // Mock implementation
}
```

### Adding Components

Components should only inject services they need:

```typescript
export const MyComponent: React.FC = () => {
  const todoService = useService<ITodoService>(TYPES.TodoService);
  // Component logic using service
};
```

## 📊 Key Benefits Demonstrated

### 1. **Service Isolation**

Components never directly access stores - only through injected services.

### 2. **Testability**

Easy mock injection through container swapping in tests.

### 3. **Type Safety**

Full TypeScript coverage with interface contracts.

### 4. **Maintainability**

Clear separation of concerns and dependency management.

### 5. **Scalability**

Easy to add new services and maintain loose coupling.

## 🔍 Code Examples

### Service with Injection

```typescript
@injectable()
export class TodoService implements ITodoService {
  constructor(@inject(TYPES.LoggingService) private logger: ILoggingService) {}

  addTodo(text: string): void {
    // Business logic
    this.logger.info("Todo added", { text });
  }
}
```

### Component with Service Injection

```typescript
export const TodoApp: React.FC = () => {
  const todoService = useService<ITodoService>(TYPES.TodoService);

  const handleAdd = (text: string) => {
    todoService.addTodo(text);
  };

  // JSX using service
};
```

### Test with Mock Services

```typescript
describe("TodoApp", () => {
  it("should use mock service", () => {
    const testContainer = createTestContainer();
    const mockService = getMockTodoService(testContainer);

    render(
      <ContainerProvider container={testContainer}>
        <TodoApp />
      </ContainerProvider>
    );

    // Test with controlled mock behavior
  });
});
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run test:watch` - Test watch mode
- `npm run test:coverage` - Coverage report
- `npm run typecheck` - TypeScript checking
- `npm run lint` - ESLint checking

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- InversifyJS team for excellent DI framework
- Zustand team for lightweight state management
- React Testing Library for testing best practices
- TypeScript team for superior developer experience
