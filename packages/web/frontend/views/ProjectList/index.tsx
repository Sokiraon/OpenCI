import { Add, Delete, PlayArrow } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Paper,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField as FormikTextField } from "formik-mui";
import React, { useCallback, useMemo, useState } from "react";
import useForceUpdate from "../../hooks/useForceUpdate";
import useMessage from "../../hooks/useMessage";
import {
  createProject,
  deleteProject,
  getProjectList,
} from "../../requests/project";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useBarTitle from "../../hooks/useBarTitle";
import DeleteProjectDialog from "../../components/DeleteProjectDialog";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Link as RouterLink } from "react-router-dom";
import Project from "@openci/core/build/project";

const TextField = styled(FormikTextField)({
  width: 400,
  marginTop: 4,
});

export default function ProjectList() {
  useDocumentTitle("OpenCI - Projects");
  useBarTitle("Projects");

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
        field: "id",
        headerName: "Project ID",
        width: 160,
        minWidth: 120,
        sortable: true,
        cellRenderer: (params: ICellRendererParams) => (
          <Link
            underline="hover"
            component={RouterLink}
            to={`/projects/${params.value}`}
          >
            {params.value}
          </Link>
        ),
      },
      {
        field: "name",
        headerName: "Name",
        flex: 2,
        sortable: true,
        cellRenderer: (params: ICellRendererParams) => (
          <Link
            underline="hover"
            component={RouterLink}
            to={`/projects/${params.data.id}`}
          >
            {params.value}
          </Link>
        ),
      },
      { field: "description", headerName: "Description", flex: 3 },
      { field: "defaultBranch", headerName: "Default Branch", flex: 2 },
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

  const [openAdd, setOpenAdd] = useState(false);
  const handleCloseAdd = useCallback(() => setOpenAdd(false), []);

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

  const initialValues = useMemo<Project.Creation>(
    () => ({
      name: "",
      description: "",
      src: "",
      defaultBranch: "",
    }),
    []
  );

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "baseline", mb: 2 }}>
        <Typography variant="h5">Project List</Typography>
        <Button
          variant="contained"
          disableElevation
          startIcon={<Add />}
          sx={{ ml: 2 }}
          size="small"
          onClick={() => setOpenAdd(true)}
        >
          Create
        </Button>
      </Box>
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
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Create Project</DialogTitle>
        <Formik
          initialValues={initialValues}
          validate={values => {
            const errors: Partial<typeof values> = {};
            for (const [key, value] of Object.entries(values)) {
              if (!value) {
                errors[key] = "Required";
              }
            }
            if (projects.findIndex(project => project.name === values.name) !== -1) {
              errors.name = "This name has already been used";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            createProject(values)
              .then(() => {
                showSuccess("Successfully created project");
                setOpenAdd(false);
                forceUpdate();
              })
              .catch(error => {
                showError(error.msg);
              })
              .finally(() => setSubmitting(false));
          }}
        >
          {({ submitForm }) => (
            <>
              <DialogContent>
                <Form>
                  <Field
                    component={TextField}
                    variant="filled"
                    name="name"
                    label="Project Name"
                    helperText="Required"
                    required
                  />
                  <br />
                  <Field
                    component={TextField}
                    variant="filled"
                    name="description"
                    label="Description"
                    helperText="Required"
                    required
                  />
                  <br />
                  <Field
                    component={TextField}
                    variant="filled"
                    name="src"
                    label="Repo URL"
                    helperText="Required"
                    required
                  />
                  <br />
                  <Field
                    component={TextField}
                    variant="filled"
                    name="defaultBranch"
                    label="Default Branch"
                    helperText="Required"
                    required
                  />
                </Form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAdd}>Cancel</Button>
                <Button onClick={submitForm}>Submit</Button>
              </DialogActions>
            </>
          )}
        </Formik>
      </Dialog>
      <DeleteProjectDialog
        open={openDelete}
        setOpen={setOpenDelete}
        onConfirm={handleDeleteProject}
      />
    </>
  );
}
