import { createTheme, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/index";
import ProjectDetail from "./views/ProjectDetail";
import ProjectList from "./views/ProjectList";
import "./App.css";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

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
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate replace to="/projects" />} />
              <Route path="/projects">
                <Route index element={<ProjectList />} />
                <Route path=":id" element={<ProjectDetail />} />
              </Route>
            </Routes>
          </Layout>
        </HashRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
