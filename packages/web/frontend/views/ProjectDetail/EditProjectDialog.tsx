import { Refresh } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  styled,
  Tooltip,
} from "@mui/material";
import { Project } from "@openci/core";
import { Field, Form, Formik } from "formik";
import { Select, TextField as FormikTextField } from "formik-mui";
import React, { useCallback, useEffect, useState } from "react";
import useMessage from "../../hooks/useMessage";
import {
  getProjectList,
  updateProject,
  verifyRepoUrl,
} from "../../requests/project";
import { ProjectDetail, RepoInfo } from "../../requests/type";

const TextField = styled(FormikTextField)({
  width: 400,
});

interface EditProjectDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projectDetail: ProjectDetail | undefined;
  onFinish: () => void;
}

export default function EditProjectDialog(props: EditProjectDialogProps) {
  const { open, setOpen, projectDetail, onFinish } = props;
  const { showSuccess, showError } = useMessage();

  const [projectList, setProjectList] = useState<Project.Record[]>([]);
  useEffect(() => {
    getProjectList().then(res => setProjectList(res.data));
  }, []);

  const [lastValidateSrc, setLastValidateSrc] = useState("");

  const [repoInfo, setRepoInfo] = useState<RepoInfo>();
  const validateSrc = useCallback((url: string) => {
    verifyRepoUrl({ url }).then(res => {
      setRepoInfo(res.data);
      setLastValidateSrc(url);
    });
  }, []);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Edit Project</DialogTitle>
      <Formik
        initialValues={
          projectDetail?.project ?? {
            id: 0,
            name: "",
            description: "",
            src: "",
            defaultBranch: "",
          }
        }
        validate={values => {
          const errors: Partial<Project.Creation> = {};
          if (
            values.name !== projectDetail?.project.name &&
            projectList.find(project => project.name === values.name)
          ) {
            errors.name = "Project name already exists";
          }
          if (
            values.src !== projectDetail?.project.src &&
            values.src !== lastValidateSrc
          ) {
            errors.src =
              "Url not validated, click the validate button before you proceed";
          }
          for (const [key, value] of Object.entries(values)) {
            if (!value) {
              errors[key] = "Required";
            }
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          updateProject(values)
            .then(() => {
              showSuccess("Successfully updated project");
              setOpen(false);
              onFinish();
            })
            .catch(error => showError(error.msg))
            .finally(() => setSubmitting(false));
        }}
      >
        {({ submitForm, values }) => (
          <>
            <DialogContent>
              <Form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "8px",
                  rowGap: "16px",
                }}
              >
                <Field
                  component={TextField}
                  name="name"
                  label="Project Name"
                  helperText="Required"
                  required
                  size="small"
                />
                <Field
                  component={TextField}
                  name="description"
                  label="Description"
                  helperText="Required"
                  required
                  size="small"
                  multiline
                  rows={2}
                />
                <Field
                  component={TextField}
                  name="src"
                  label="Repo Src"
                  helperText="Required"
                  required
                  size="small"
                  multiline
                  InputProps={{
                    endAdornment: (
                      <Tooltip title="validate" placement="right">
                        <IconButton
                          edge="end"
                          onClick={() => validateSrc(values.src)}
                        >
                          <Refresh />
                        </IconButton>
                      </Tooltip>
                    ),
                  }}
                />
                <Field
                  component={Select}
                  name="defaultBranch"
                  label="Default Branch"
                  helperText="Required"
                  required
                  size="small"
                >
                  {(repoInfo ?? projectDetail?.repoInfo)?.branches.map(branch => (
                    <MenuItem value={branch} key={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </Field>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submitForm}>Confirm</Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
