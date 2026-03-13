import * as Mantine from "@mantine/core";
import { Moon, Sun } from "lucide-react";
import { Outlet } from "react-router";
import { Fragment } from "react/jsx-runtime";

export default function Layout() {
  const { setColorScheme, colorScheme } = Mantine.useMantineColorScheme();
  return (
    <Fragment>
      <Mantine.Paper shadow="xs" py="xs" radius={0}>
        <Mantine.Container size="xl">
          <Mantine.Group justify="space-between" align="center">
            <Mantine.Title order={3}>Profee.tools</Mantine.Title>
            <Mantine.ActionIcon
              variant="subtle"
              size="lg"
              onClick={() =>
                setColorScheme(colorScheme === "dark" ? "light" : "dark")
              }
            >
              {colorScheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Mantine.ActionIcon>
          </Mantine.Group>
        </Mantine.Container>
      </Mantine.Paper>
      <Mantine.Container size="xl" mt="lg">
        <Outlet />
      </Mantine.Container>
    </Fragment>
  );
}
