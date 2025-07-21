import React from "react";
import { ContainerProvider } from "@/hooks/useContainer";
import { container } from "@/container";
import { TodoApp } from "@/components/TodoApp";

const App: React.FC = () => {
  return (
    <ContainerProvider container={container}>
      <TodoApp />
    </ContainerProvider>
  );
};

export default App;
