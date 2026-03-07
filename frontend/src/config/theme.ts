import { createElement } from "react";

import * as Mantine from "@mantine/core";

import { ChevronDown } from "lucide-react";

const theme = Mantine.createTheme({
  activeClassName: "",
  primaryColor: "orange",
  primaryShade: 8,
  defaultRadius: "md",
  black: "#212121",
  headings: {
    fontWeight: "600",
  },
  components: {
    NumberInput: Mantine.NumberInput.extend({
      defaultProps: {
        hideControls: true,
      },
    }),
    TableTh: Mantine.Table.Th.extend({
      defaultProps: {
        fw: 600,
      },
    }),
    Modal: Mantine.Modal.extend({
      defaultProps: {
        centered: true,
        classNames: {
          content: "app-modal-content",
        },
      },
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
        p: Mantine.rem(20),
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
  },
});

export default theme;
