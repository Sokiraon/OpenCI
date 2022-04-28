import { createTheme, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import ProjectDetailPage from "./views/ProjectDetail";
import ProjectList from "./views/ProjectList";
import Dashboard from "./views/Dashboard";
import "./App.css";

import "@fontsource/noto-serif";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import CreateProject from "./views/CreateProject";
import ProjectActivity from "./views/ProjectDetail/ProjectActivity";
import ProjectConfig from "./views/ProjectDetail/ProjectConfig";

const theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "'Segoe UI'",
      "Roboto",
      "'Helvetica Neue'",
      "Arial",
      "sans-serif",
      "'Apple Color Emoji'",
      "'Segoe UI Emoji'",
      "'Segoe UI Symbol'",
    ].join(","),
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Navigate replace to="/projects" />} />
              <Route path="projects">
                <Route index element={<ProjectList />} />
                <Route path="create" element={<CreateProject />} />
                <Route path=":id" element={<ProjectDetailPage />}>
                  <Route path="activity" element={<ProjectActivity />} />
                  <Route path="config" element={<ProjectConfig />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </HashRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
