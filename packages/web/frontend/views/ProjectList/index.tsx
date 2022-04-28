import { Delete, PlayArrow } from "@mui/icons-material";
import { Box, Button, Link, Paper, Tooltip, Typography } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import useForceUpdate from "../../hooks/useForceUpdate";
import useMessage from "../../hooks/useMessage";
import { deleteProject, getProjectList } from "../../requests/project";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import DeleteProjectDialog from "../../components/DeleteProjectDialog";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Project from "@openci/core/build/project";
import { SecondaryBar } from "../Dashboard";

export default function ProjectList() {
  useDocumentTitle("OpenCI - Projects");

  const navigate = useNavigate();
  const { showSuccess, showError } = useMessage();

  const [projects, setProjects] = useState<Project.Record[]>([]);

  const forceUpdate = useForceUpdate(() => {
    getProjectList().then(res => {
      setProjects(res.data);
    });
  });

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        sortable: true,
        cellRenderer: (params: ICellRendererParams) => (
          <Link
            underline="hover"
            component={RouterLink}
            to={`/projects/${params.data.id}/activity`}
          >
            {params.value}
          </Link>
        ),
      },
      { field: "description", headerName: "Description", flex: 2 },
      {
        field: "defaultBranch",
        headerName: "Default Branch",
        flex: 1,
        resizable: false,
      },
      {
        headerName: "Actions",
        pinned: "right",
        width: 240,
        minWidth: 200,
        cellRenderer: (params: ICellRendererParams) => (
          <Box sx={{ display: "flex", alignItems: "center", columnGap: "16px" }}>
            <Tooltip title="Run">
              <Button variant="contained" disableElevation color="success">
                <PlayArrow />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                variant="contained"
                disableElevation
                color="warning"
                onClick={() => {
                  setSelectedId(params.data.id);
                  setOpenDelete(true);
                }}
              >
                <Delete />
              </Button>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  const [openDelete, setOpenDelete] = useState(false);

  const [selectedId, setSelectedId] = useState<number>();
  const handleDeleteProject = useCallback(() => {
    deleteProject({ id: selectedId ?? 0 })
      .then(() => {
        showSuccess("Successfully deleted project");
        setSelectedId(undefined);
        forceUpdate();
      })
      .catch(error => showError(error.msg))
      .finally(() => setOpenDelete(false));
  }, [forceUpdate, selectedId, showError, showSuccess]);

  return (
    <>
      <SecondaryBar>
        <Typography variant="h6" color="white" sx={{ width: "160px", flex: 1 }}>
          Projects
        </Typography>
        <Button
          color="inherit"
          variant="outlined"
          sx={{ color: "white", borderColor: "white" }}
          disableElevation
          size="small"
          onClick={() => navigate("/projects/create")}
        >
          New Project
        </Button>
      </SecondaryBar>
      <Box sx={{ p: 3 }}>
        <Paper className="ag-theme-material" sx={{ width: 1, overflow: "hidden" }}>
          <AgGridReact
            columnDefs={columnDefs}
            defaultColDef={{ minWidth: 160, resizable: true }}
            rowData={projects}
            domLayout="autoHeight"
            animateRows
            enableCellTextSelection
          />
        </Paper>
      </Box>
      <DeleteProjectDialog
        open={openDelete}
        setOpen={setOpenDelete}
        onConfirm={handleDeleteProject}
      />
    </>
  );
}
