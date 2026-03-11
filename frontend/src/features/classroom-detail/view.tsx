import * as Mantine from "@mantine/core";
import { Fragment, useEffect } from "react";
import {
  generatePath,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";

import routes from "../../constants/routes";

export default function ClassroomDetailView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { classroomId = "" } = useParams();

  const tabRoutes = {
    activities: generatePath(routes.CLASSROOM_DETAIL_ACTIVITIES, {
      classroomId,
    }),
    scores: generatePath(routes.CLASSROOM_DETAIL_SCORES, { classroomId }),
    students: generatePath(routes.CLASSROOM_DETAIL_STUDENTS, { classroomId }),
    attendances: generatePath(routes.CLASSROOM_DETAIL_ATTENDANCES, {
      classroomId,
    }),
  };

  const activeTab = (() => {
    if (location.pathname.includes("/scores")) return "scores";
    if (location.pathname.includes("/students")) return "students";
    if (location.pathname.includes("/attendances")) return "attendances";
    return "activities";
  })();

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    navigate(tabRoutes[value as keyof typeof tabRoutes]);
  };

  useEffect(() => {
    const detailRoutePath = generatePath(routes.CLASSROOM_DETAIL, {
      classroomId,
    });

    if (location.pathname === detailRoutePath) {
      navigate(tabRoutes.activities, { replace: true });
    }
  }, [classroomId, location.pathname, navigate, tabRoutes.activities]);

  const renderComponent = () => {
    return (
      <Fragment>
        <Mantine.Group justify="space-between" align="center">
          <Mantine.Box>
            <Mantine.Title order={2}>Clase de Matematicas</Mantine.Title>
          </Mantine.Box>
          <Mantine.Button variant="light">Configuracion</Mantine.Button>
        </Mantine.Group>

        <Mantine.Tabs value={activeTab} onChange={handleTabChange} mt="lg">
          <Mantine.Tabs.List>
            <Mantine.Tabs.Tab value="activities">Actividades</Mantine.Tabs.Tab>
            <Mantine.Tabs.Tab value="scores">Calificaciones</Mantine.Tabs.Tab>
            <Mantine.Tabs.Tab value="students">Estudiantes</Mantine.Tabs.Tab>
            <Mantine.Tabs.Tab value="attendances">Asistencias</Mantine.Tabs.Tab>
          </Mantine.Tabs.List>
        </Mantine.Tabs>

        <Mantine.Box mt="lg">
          <Outlet />
        </Mantine.Box>
      </Fragment>
    );
  };

  return renderComponent();
}
