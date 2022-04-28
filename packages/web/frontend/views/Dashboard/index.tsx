import {
  AppBar,
  Box,
  CssBaseline,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import React, { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export function SecondaryBar(props: { children?: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 3,
        height: 64,
        background: blue[600],
        color: "white",
      }}
    >
      {props.children}
    </Box>
  );
}

interface TabConfig {
  title: string;
  path: string;
}

export default function Dashboard() {
  const { pathname } = useLocation();
  const [tabValue, setTabValue] = useState<string | false>(pathname);

  const tabConfigs = useMemo<TabConfig[]>(
    () => [{ title: "Projects", path: "/projects" }],
    []
  );

  useEffect(() => {
    if (tabConfigs.find(config => config.path === pathname)) {
      setTabValue(pathname);
    } else {
      setTabValue(false);
    }
  }, [pathname, tabConfigs]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", background: "#f4f5f7" }}>
      <CssBaseline />
      <AppBar position="fixed" elevation={0} className="Dashboard-appBar">
        <Toolbar variant="dense">
          <Typography variant="h5" sx={{ width: "160px", fontFamily: "Noto Serif" }}>
            OpenCI
          </Typography>
          <Tabs
            textColor="inherit"
            value={tabValue}
            sx={{
              "& .MuiTabs-indicator": {
                background: "white",
              },
            }}
          >
            {tabConfigs.map(config => (
              <Tab
                key={config.path}
                label={config.title}
                component={Link}
                value={config.path}
                to={config.path}
              />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flex: 1 }}>
        <Toolbar variant="dense" />
        <Outlet />
      </Box>
    </Box>
  );
}
