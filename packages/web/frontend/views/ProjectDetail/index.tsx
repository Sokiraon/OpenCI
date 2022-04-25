import {
  Cancel,
  CheckCircle,
  Delete,
  DoDisturbOn,
  Edit,
  MoreHoriz,
  PlayArrow,
} from "@mui/icons-material";
import {
  Box,
  BoxProps,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { TextField as FormikTextField } from "formik-mui";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobDetailDialog from "./JobDetailDialog";
import DeleteProjectDialog from "../../components/DeleteProjectDialog";
import TextSkeleton from "../../components/TextSkeleton";
import useBarTitle from "../../hooks/useBarTitle";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useForceUpdate from "../../hooks/useForceUpdate";
import useMessage from "../../hooks/useMessage";
import { deleteProject, getProjectDetail } from "../../requests/project";
import Project from "@openci/core/build/project";
import Job from "@openci/core/build/job";
import EditProjectDialog from "./EditProjectDialog";
import StartJobDialog from "./StartJobDialog";

interface UrlParams extends Record<string, any> {
  id: number;
}

const ProjectInfoItem = (props: { label: string; content?: string }) => (
  <Box sx={{ display: "flex" }}>
    <Typography variant="body1" sx={{ color: "text.secondary", width: "160px" }}>
      {props.label}
    </Typography>
    <TextSkeleton variant="body1" minWidth={128} content={props.content} />
  </Box>
);

const TextField = styled(FormikTextField)({
  width: 400,
  marginTop: 4,
});

const StatusCell = (props: BoxProps & { tip: string }) => (
  <Tooltip title={props.tip} placement="right">
    <Box
      sx={{
        width: 24,
        height: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      {...props}
    ></Box>
  </Tooltip>
);

export default function ProjectDetail() {
  useDocumentTitle("OpenCI - Project Detail");
  useBarTitle("Project Detail");

  const { showSuccess, showError } = useMessage();

  const { id } = useParams<UrlParams>();
  const navigate = useNavigate();

  const [projectDetail, setProjectDetail] = useState<{
    project: Project.Record;
    jobs: Job.Record[];
  }>();

  const forceUpdate = useForceUpdate(() => {
    if (id) {
      getProjectDetail(id).then(res => {
        setProjectDetail(res.data);
      });
    }
  }, [id]);

  const [jobToView, setJobToView] = useState<Job.Record>();
  const [openJobDetail, setOpenJobDetail] = useState(false);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "status",
        headerName: "Status",
        width: 104,
        minWidth: 104,
        cellRenderer: (params: ICellRendererParams) => {
          switch (params.value) {
            case 0:
              return (
                <StatusCell tip="Running">
                  <CircularProgress disableShrink size={20} />
                </StatusCell>
              );
            case 1:
              return (
                <StatusCell tip="Cancelled">
                  <DoDisturbOn color="disabled" />
                </StatusCell>
              );
            case 2:
              return (
                <StatusCell tip="Success">
                  <CheckCircle color="success" />
                </StatusCell>
              );
            default:
              return (
                <StatusCell tip="Failure">
                  <Cancel color="error" />
                </StatusCell>
              );
          }
        },
      },
      { field: "id", headerName: "Job ID", width: 200 },
      { field: "createdAt", headerName: "Created At", flex: 2, sort: "desc" },
      { field: "updatedAt", headerName: "Updated At", flex: 3 },
      {
        headerName: "Actions",
        pinned: "right",
        sortable: false,
        width: 160,
        minWidth: 120,
        cellRenderer: (params: ICellRendererParams) => (
          <Tooltip title="Detail" placement="left">
            <IconButton
              onClick={() => {
                setJobToView(params.data);
                setOpenJobDetail(true);
              }}
            >
              <MoreHoriz />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      minWidth: 200,
      sortable: true,
      resizable: true,
    }),
    []
  );

  const [openRun, setOpenRun] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleDeleteProject = useCallback(() => {
    deleteProject({ id: id ?? 0 })
      .then(() => {
        showSuccess("Successfully deleted project");
        navigate("/projects");
      })
      .catch(error => showError(error.msg))
      .finally(() => setOpenDelete(false));
  }, [id, showError, showSuccess, navigate]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "baseline", mb: 2 }}>
        <TextSkeleton
          variant="h4"
          sx={{ minWidth: "144px" }}
          content={projectDetail?.project.name}
        />
        <Box sx={{ display: "flex", columnGap: "8px", ml: 2 }}>
          <Button
            startIcon={<PlayArrow />}
            variant="contained"
            disableElevation
            size="small"
            onClick={() => setOpenRun(true)}
          >
            Start Job
          </Button>
          <Button
            startIcon={<Edit />}
            variant="contained"
            disableElevation
            color="info"
            size="small"
            onClick={() => setOpenEdit(true)}
          >
            Edit
          </Button>
          <Button
            startIcon={<Delete />}
            variant="contained"
            disableElevation
            color="warning"
            size="small"
            onClick={() => setOpenDelete(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: "4px", mb: 2 }}>
        <ProjectInfoItem
          label="Description:"
          content={projectDetail?.project.description}
        />
        <ProjectInfoItem label="Repo Src:" content={projectDetail?.project.src} />
        <ProjectInfoItem
          label="Default Branch:"
          content={projectDetail?.project.defaultBranch}
        />
      </Box>
      <Paper className="ag-theme-material" sx={{ width: 1, overflow: "hidden" }}>
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={projectDetail?.jobs}
          domLayout="autoHeight"
          animateRows
          enableCellTextSelection
          pagination
          paginationPageSize={8}
        />
      </Paper>
      <StartJobDialog
        open={openRun}
        setOpen={setOpenRun}
        project={projectDetail?.project}
        onFinish={() => forceUpdate()}
      />
      <EditProjectDialog
        open={openEdit}
        setOpen={setOpenEdit}
        project={projectDetail?.project}
        onFinish={() => forceUpdate()}
      />
      <DeleteProjectDialog
        open={openDelete}
        setOpen={setOpenDelete}
        onConfirm={handleDeleteProject}
      />
      <JobDetailDialog
        open={openJobDetail}
        setOpen={setOpenJobDetail}
        project={projectDetail?.project}
        job={jobToView}
      />
    </>
  );
}
