import { MantineProvider } from "@mantine/core";
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import { RouterProvider } from "react-router";

import router from "./app/router";
import theme from "./config/theme";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
