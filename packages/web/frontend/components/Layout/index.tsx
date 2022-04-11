import { ChevronLeft, ListAlt, Menu } from "@mui/icons-material";
import {
  AppBar,
  AppBarProps,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
  Typography,
} from "@mui/material";
import { CSSObject, styled, Theme } from "@mui/material/styles";
import React, { useCallback, useState } from "react";
import MenuListItem from "./MenuListItem";

const drawerWidth = 208;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

interface MyAppBarProps extends AppBarProps {
  open?: boolean;
}

const MyAppBar = styled(AppBar, {
  shouldForwardProp: prop => prop !== "open",
})<MyAppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const MyDrawer = styled(Drawer, { shouldForwardProp: prop => prop !== "open" })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  })
);

interface LayoutProps {
  children?: React.ReactNode;
}

export const TitleContext = React.createContext({
  title: "Projects",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTitle: (_newTitle: string) => {
    // doNothing
  },
});

export default function Layout(props: LayoutProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const updateTitle = useCallback((newTitle: string) => {
    setTitle(newTitle);
  }, []);

  return (
    <TitleContext.Provider value={{ title: title, setTitle: updateTitle }}>
      <Box sx={{ minHeight: "100vh", display: "flex", background: "#f4f5f7" }}>
        <CssBaseline />
        <MyAppBar position="fixed" open={open}>
          <Toolbar variant="dense">
            <IconButton
              color="inherit"
              onClick={() => setOpen(true)}
              edge="start"
              sx={open ? { display: "none" } : {}}
            >
              <Menu />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ ml: open ? 1 : "44px" }}
            >
              {title}
            </Typography>
          </Toolbar>
        </MyAppBar>

        <MyDrawer variant="permanent" open={open}>
          <Toolbar variant="dense" sx={{ justifyContent: "flex-end" }}>
            <IconButton onClick={() => setOpen(false)} edge="end">
              <ChevronLeft />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            <MenuListItem
              title="Projects"
              path="/projects"
              icon={<ListAlt />}
              open={open}
            />
          </List>
        </MyDrawer>

        <Box component="main" sx={{ flexGrow: 1 }}>
          <Toolbar variant="dense" />
          <Box sx={{ mx: 4, my: "20px" }}>{props.children}</Box>
        </Box>
      </Box>
    </TitleContext.Provider>
  );
}
