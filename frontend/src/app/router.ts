import { createBrowserRouter } from "react-router";

import routes from "../constants/routes";

import Layout from "../common/layout/Layout";
import SignInContainer from "../features/sign-in/container";
import ClassroomsContainer from "../features/classrooms/container";
import ClassroomDetailContainer from "../features/classroom-detail/container";
import ActivitiesContainer from "../features/classroom-detail/activities/container";
import ScoresContainer from "../features/classroom-detail/scores/container";
import StudentsContainer from "../features/classroom-detail/students/container";
import AttendancesContainer from "../features/classroom-detail/attendances/container";

const router = createBrowserRouter([
  {
    path: routes.SIGN_IN,
    Component: SignInContainer,
  },
  {
    path: routes.OVERVIEW,
    Component: Layout,
    children: [
      {
        path: routes.CLASSROOMS,
        Component: ClassroomsContainer,
      },
      {
        path: routes.CLASSROOM_DETAIL,
        Component: ClassroomDetailContainer,
        children: [
          {
            path: routes.CLASSROOM_DETAIL_ACTIVITIES,
            Component: ActivitiesContainer,
          },
          {
            path: routes.CLASSROOM_DETAIL_SCORES,
            Component: ScoresContainer,
          },
          {
            path: routes.CLASSROOM_DETAIL_STUDENTS,
            Component: StudentsContainer,
          },
          {
            path: routes.CLASSROOM_DETAIL_ATTENDANCES,
            Component: AttendancesContainer,
          },
        ],
      },
    ],
  },
]);

export default router;
