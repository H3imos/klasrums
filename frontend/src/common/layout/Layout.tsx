import * as Mantine from "@mantine/core";
import { Outlet } from "react-router";
import { Fragment } from "react/jsx-runtime";

export default function Layout() {
  return (
    <Fragment>
      <Mantine.Paper shadow="xs" py="xs" radius={0}>
        <Mantine.Container size="xl">
          <Mantine.Title order={3}>Klasrums</Mantine.Title>
        </Mantine.Container>
      </Mantine.Paper>
      <Mantine.Container size="xl" mt="lg">
        <Outlet />
      </Mantine.Container>
    </Fragment>
  );
}
