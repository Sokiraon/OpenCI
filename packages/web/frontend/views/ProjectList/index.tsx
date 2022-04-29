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
import { SecondaryBar } from "../Dashboard";
import { ProjectList } from "../../requests/type";
import { Job } from "@openci/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloud,
  faCloudBolt,
  faCloudRain,
  faCloudSun,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

export default function ProjectList() {
  useDocumentTitle("OpenCI - Projects");

  const navigate = useNavigate();
  const { showSuccess, showError } = useMessage();

  const [projectList, setProjectList] = useState<ProjectList>([]);

  const forceUpdate = useForceUpdate(() => {
    getProjectList().then(res => {
      setProjectList(res.data.projects);
    });
  });

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "Health",
        width: 96,
        minWidth: 96,
        cellRenderer: (params: ICellRendererParams) => {
          const jobs = params.data.jobs as Job.Record[];
          const finishedJobs = jobs.filter(job => job.status === 0).length;
          const successJobs = jobs.filter(job => job.status === 2).length;
          const successRate = finishedJobs / successJobs;
          let icon = faSun;
          if (successRate <= 0.2) {
            icon = faCloudBolt;
          } else if (successRate <= 0.4) {
            icon = faCloudRain;
          } else if (successRate <= 0.6) {
            icon = faCloud;
          } else if (successRate <= 0.8) {
            icon = faCloudSun;
          } else {
            icon = faSun;
          }
          return (
            <FontAwesomeIcon icon={icon} width={40} style={{ fontSize: "18px" }} />
          );
        },
      },
      {
        field: "info.name",
        headerName: "Name",
        flex: 1,
        minWidth: 120,
        sortable: true,
        cellRenderer: (params: ICellRendererParams) => (
          <Link
            underline="hover"
            component={RouterLink}
            to={`/projects/${params.data.info.id}/activity`}
          >
            {params.value}
          </Link>
        ),
      },
      {
        field: "info.description",
        headerName: "Description",
        flex: 2,
        minWidth: 240,
      },
      {
        headerName: "Jobs Created",
        sortable: true,
        cellRenderer: (params: ICellRendererParams) =>
          params.data.jobs.length || "N/A",
      },
      {
        headerName: "Latest Activity",
        flex: 1,
        resizable: false,
        sortable: true,
        minWidth: 200,
        cellRenderer: (params: ICellRendererParams) => {
          const lastJob: Job.Record = params.data.jobs[params.data.jobs.length - 1];
          if (lastJob) {
            return new Date(lastJob.updatedAt).toLocaleString();
          } else {
            return "N/A";
          }
        },
      },
      {
        headerName: "Actions",
        pinned: "right",
        width: 120,
        minWidth: 120,
        cellRenderer: (params: ICellRendererParams) => (
          <Box sx={{ display: "flex", alignItems: "center", columnGap: "16px" }}>
            {/* <Tooltip title="Run">
              <Button variant="contained" disableElevation color="success">
                <PlayArrow />
              </Button>
            </Tooltip> */}
            <Tooltip title="Delete">
              <Button
                variant="contained"
                disableElevation
                color="warning"
                onClick={() => {
                  setSelectedId(params.data.info.id);
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
            defaultColDef={{ resizable: true }}
            rowData={projectList}
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
