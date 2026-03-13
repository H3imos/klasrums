import * as Mantine from "@mantine/core";
import { Fragment, useEffect } from "react";
import {
  generatePath,
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";

import CreateClassroom from "../classrooms/components/create-classroom";
import type { CreateClassroomFormPayload } from "../classrooms/types";
import routes from "../../constants/routes";
import { ChevronDown, ChevronLeft, Pencil, Trash2 } from "lucide-react";

type ClassroomDetailViewProps = {
  classroomName: string;
  classroomRoom: string;
  editModalOpened: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  errorMessage?: string;
  onOpenEditModal: () => void;
  onCloseEditModal: () => void;
  onEditClassroom: (payload: CreateClassroomFormPayload) => void;
  onDeleteClassroom: () => void;
};

export default function ClassroomDetailView({
  classroomName,
  classroomRoom,
  editModalOpened,
  isEditing,
  isDeleting,
  errorMessage,
  onOpenEditModal,
  onCloseEditModal,
  onEditClassroom,
  onDeleteClassroom,
}: ClassroomDetailViewProps) {
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
          <Mantine.Group gap="xs">
            <Mantine.ActionIcon
              variant="subtle"
              size="lg"
              component={Link}
              to={routes.CLASSROOMS}
            >
              <ChevronLeft style={{ width: 24, height: 24 }} />
            </Mantine.ActionIcon>
            <Mantine.Title order={2}>{classroomName}</Mantine.Title>
          </Mantine.Group>

          <Mantine.Menu
            shadow="md"
            width={180}
            position="bottom-end"
            withinPortal
          >
            <Mantine.Menu.Target>
              <Mantine.Button
                variant="light"
                rightSection={<ChevronDown />}
                data-testid="classroom-detail-settings-button"
              >
                Configuración
              </Mantine.Button>
            </Mantine.Menu.Target>

            <Mantine.Menu.Dropdown>
              <Mantine.Menu.Item
                leftSection={<Pencil size={14} />}
                onClick={onOpenEditModal}
                data-testid="classroom-detail-edit-button"
              >
                Editar curso
              </Mantine.Menu.Item>
              <Mantine.Menu.Item
                color="red"
                leftSection={<Trash2 size={14} />}
                onClick={onDeleteClassroom}
                disabled={isDeleting}
                data-testid="classroom-detail-delete-button"
              >
                Eliminar curso
              </Mantine.Menu.Item>
            </Mantine.Menu.Dropdown>
          </Mantine.Menu>
        </Mantine.Group>

        {errorMessage ? (
          <Mantine.Alert color="red" mt="md" variant="light">
            {errorMessage}
          </Mantine.Alert>
        ) : null}

        <CreateClassroom
          key={classroomName}
          opened={editModalOpened}
          mode="edit"
          initialValues={{
            className: classroomName,
            classroom: classroomRoom,
          }}
          onClose={onCloseEditModal}
          onSave={onEditClassroom}
          isSaving={isEditing}
          errorMessage={errorMessage}
        />

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
