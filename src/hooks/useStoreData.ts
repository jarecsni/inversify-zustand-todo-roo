import { useEffect, useState } from "react";

/**
 * Hook for subscribing to data from a service method
 * This provides a clean way for components to get reactive data from services
 * without directly accessing stores
 */
export function useStoreData<T>(service: any, dataGetter: () => T): T {
  const [data, setData] = useState<T>(() => dataGetter());

  useEffect(() => {
    // Get initial data
    const initialData = dataGetter();
    setData(initialData);

    // Subscribe to changes if the service has a subscribe method
    if (service.subscribe && typeof service.subscribe === "function") {
      const unsubscribe = service.subscribe((newData: T) => {
        setData(newData);
      });

      return unsubscribe;
    }
  }, [service]); // Only depend on service, not dataGetter to avoid infinite loops

  return data;
}
