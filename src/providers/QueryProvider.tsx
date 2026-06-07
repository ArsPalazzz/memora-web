"use client";

import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactNode, useState } from "react";
import {
  ROOT_FOLDERS,
  USER_DAILY,
  USER_DESK,
  USER_DESKS,
} from "@/routes/react-query";

const PERSISTED_KEYS = new Set([
  USER_DAILY,
  USER_DESKS,
  USER_DESK,
  ROOT_FOLDERS,
]);

const PERSIST_MAX_AGE = 1000 * 60 * 60 * 24;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: PERSIST_MAX_AGE,
        refetchOnWindowFocus: false,
      },
    },
  });
}

function getPersister() {
  if (isServer) return undefined;
  return createSyncStoragePersister({
    storage: window.localStorage,
    key: "memora-query-cache",
  });
}

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => makeQueryClient());
  const [persister] = useState(() => getPersister());

  if (!persister) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={client}
      persistOptions={{
        persister,
        maxAge: PERSIST_MAX_AGE,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) =>
            PERSISTED_KEYS.has(query.queryKey[0] as string),
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
