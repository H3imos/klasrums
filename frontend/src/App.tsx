import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router";

import router from "./app/router";
import theme from "./config/theme";

import "@mantine/core/styles.css";

function App() {
  return (
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
