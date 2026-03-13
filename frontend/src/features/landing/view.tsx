import * as Mantine from "@mantine/core";
import {
  BookOpenCheck,
  ChartColumnIncreasing,
  ClipboardList,
  Users,
} from "lucide-react";
import { Link } from "react-router";

import routes from "../../constants/routes";

const features = [
  {
    title: "Clases y periodos",
    description:
      "Organiza tus cursos por periodos y mantén toda la planeación académica en una sola vista.",
    icon: BookOpenCheck,
  },
  {
    title: "Actividades y calificaciones",
    description:
      "Crea actividades con ponderación y registra notas en tabla tipo Excel, incluso dejando celdas vacías.",
    icon: ChartColumnIncreasing,
  },
  {
    title: "Gestión de estudiantes",
    description:
      "Administra estudiantes por clase con acciones rápidas para crear, editar y mantener listados actualizados.",
    icon: Users,
  },
  {
    title: "Asistencias",
    description:
      "Controla asistencia por clase y fecha para detectar tendencias y tomar decisiones oportunas.",
    icon: ClipboardList,
  },
];

export default function LandingView() {
  return (
    <Mantine.Box
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 10% 10%, #fff5d6 0%, #ffffff 45%, #eef7ff 100%)",
      }}
      px="md"
      py="xl"
    >
      <Mantine.Container size="lg">
        <Mantine.Group justify="space-between" align="center" mb="xl">
          <Mantine.Title order={2} c="dark.8">
            Profee.tools
          </Mantine.Title>

          <Mantine.Group>
            <Mantine.Button
              component={Link}
              to={routes.SIGN_IN}
              variant="default"
              data-testid="landing-signin-button"
            >
              Iniciar sesión
            </Mantine.Button>
            <Mantine.Button
              component={Link}
              to={routes.CLASSROOMS}
              data-testid="landing-overview-button"
            >
              Ir al panel
            </Mantine.Button>
          </Mantine.Group>
        </Mantine.Group>

        <Mantine.Stack gap="lg" mb="xl">
          <Mantine.Badge
            variant="light"
            color="orange"
            size="lg"
            w="fit-content"
          >
            Plataforma para gestión académica
          </Mantine.Badge>
          <Mantine.Title order={1} maw={760} c="dark.9">
            Administra tus clases, actividades, notas y asistencia desde un solo
            lugar.
          </Mantine.Title>
          <Mantine.Text size="lg" c="dimmed" maw={760}>
            Profee.tools te ayuda a centralizar la operación docente con una
            interfaz moderna, rápida y enfocada en flujo real de aula.
          </Mantine.Text>
        </Mantine.Stack>

        <Mantine.SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Mantine.Paper
                key={feature.title}
                withBorder
                radius="md"
                p="lg"
                shadow="xs"
              >
                <Mantine.Group align="flex-start" wrap="nowrap">
                  <Mantine.ThemeIcon
                    color="orange"
                    variant="light"
                    size={42}
                    radius="md"
                  >
                    <Icon size={20} />
                  </Mantine.ThemeIcon>
                  <Mantine.Stack gap={6}>
                    <Mantine.Text fw={700}>{feature.title}</Mantine.Text>
                    <Mantine.Text c="dimmed">
                      {feature.description}
                    </Mantine.Text>
                  </Mantine.Stack>
                </Mantine.Group>
                <Mantine.Button
                  component={Link}
                  to={routes.SIGN_IN}
                  variant="subtle"
                  mt="md"
                  data-testid={`landing-feature-${index}-button`}
                >
                  Explorar feature
                </Mantine.Button>
              </Mantine.Paper>
            );
          })}
        </Mantine.SimpleGrid>
      </Mantine.Container>
    </Mantine.Box>
  );
}
