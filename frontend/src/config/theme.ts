import { createElement } from "react";

import * as Mantine from "@mantine/core";

import { ChevronDown } from "lucide-react";

const theme = Mantine.createTheme({
  activeClassName: "",
  primaryColor: "orange",
  primaryShade: 8,
  defaultRadius: "md",
  black: Mantine.DEFAULT_THEME.colors.dark[4],
  headings: {
    fontWeight: "600",
  },
  fontSizes: {
    xs: Mantine.rem(14),
    sm: Mantine.rem(16),
  },
  components: {
    Badge: Mantine.Badge.extend({
      defaultProps: {
        size: "lg",
      },
    }),
    NumberInput: Mantine.NumberInput.extend({
      defaultProps: {
        hideControls: true,
      },
    }),
    Modal: Mantine.Modal.extend({
      defaultProps: {
        centered: true,
      },
      styles: (theme) => ({
        header: {
          borderBottom: `1px solid ${theme.colors.gray[3]}`,
          marginBottom: theme.spacing.sm,
        },
        title: {
          fontWeight: theme.headings.fontWeight,
          fontSize: theme.headings.sizes.h3.fontSize,
        },
      }),
    }),
    Menu: Mantine.Menu.extend({
      defaultProps: {
        shadow: "sm",
      },
    }),
    Title: Mantine.Title.extend({
      defaultProps: {
        fw: 600,
      },
    }),
    Paper: Mantine.Paper.extend({
      defaultProps: {
        shadow: "sm",
        withBorder: true,
      },
    }),
    MenuItem: Mantine.Menu.Item.extend({
      defaultProps: {
        py: 5,
      },
    }),
    Select: Mantine.Select.extend({
      defaultProps: {
        searchable: true,
        limit: 10,
        checkIconPosition: "right",
        rightSection: createElement(ChevronDown),
      },
    }),
    TableTh: Mantine.Table.Th.extend({
      defaultProps: {
       fw: 600,
      },
    }),
  },
});

export default theme;
