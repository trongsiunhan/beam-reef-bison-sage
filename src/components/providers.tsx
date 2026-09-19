import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useOrbitStore } from "@/lib/store";

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
      }),
  );
  const setHydrated = useOrbitStore((s) => s.setHydrated);

  useEffect(() => {
    void useOrbitStore.persist.rehydrate();
    if (useOrbitStore.persist.hasHydrated()) setHydrated(true);
    const unsub = useOrbitStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, [setHydrated]);

  return (
    <QueryClientProvider client={client}>
      <TooltipProvider>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            className: "font-sans",
            style: {
              background: "var(--color-surface)",
              color: "var(--color-fg)",
              border: "1px solid var(--color-border)",
            },
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
