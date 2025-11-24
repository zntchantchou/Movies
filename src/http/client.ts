import { QueryClient } from "@tanstack/react-query";

const httpClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 120 * 1000,
    },
  },
});

export default httpClient;
