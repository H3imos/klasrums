import { MantineProvider, type CSSVariablesResolver } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";

import router from "./app/router";
import theme from "./config/theme";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { ModalsProvider } from "@mantine/modals";

const queryClient = new QueryClient();

function App() {
  const resolver: CSSVariablesResolver = (theme) => ({
    variables: {},
    light: {},
    dark: {
      "--mantine-color-gray-0": theme.colors.dark[8],
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} cssVariablesResolver={resolver}>
        <ModalsProvider>
          <Notifications />
          <RouterProvider router={router} />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
