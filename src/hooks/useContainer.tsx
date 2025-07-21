import React, { createContext, useContext } from "react";
import { Container } from "inversify";

const ContainerContext = createContext<Container | null>(null);

export interface ContainerProviderProps {
  container: Container;
  children: React.ReactNode;
}

export const ContainerProvider: React.FC<ContainerProviderProps> = ({
  container,
  children,
}) => {
  return (
    <ContainerContext.Provider value={container}>
      {children}
    </ContainerContext.Provider>
  );
};

export const useContainer = (): Container => {
  const container = useContext(ContainerContext);
  if (!container) {
    throw new Error("useContainer must be used within a ContainerProvider");
  }
  return container;
};

export const useService = <T,>(serviceIdentifier: symbol): T => {
  const container = useContainer();
  return container.get<T>(serviceIdentifier);
};
