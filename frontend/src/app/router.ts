import { createBrowserRouter } from "react-router";

import Layout from "../common/layout/Layout";
import SignInContainer from "../features/sign-in/container";
import ClassroomsContainer from "../features/classrooms/container";

const router = createBrowserRouter([
  {
    path: "/sign-in",
    Component: SignInContainer,
  },
  {
    path: "/overview",
    Component: Layout,
    children: [
      {
        path: "/overview/classrooms",
        Component: ClassroomsContainer,
      },
    ],
  },
]);

export default router;
