import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
} from "@mui/material";
import { Project } from "@openci/core";
import { Field, Form, Formik } from "formik";
import { TextField as FormikTextField } from "formik-mui";
import React from "react";
import useMessage from "../../hooks/useMessage";
import { updateProject } from "../../requests/project";

const TextField = styled(FormikTextField)({
  width: 400,
  marginTop: 4,
});

interface EditProjectDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  project: Project.Record | undefined;
  onFinish: () => void;
}

export default function EditProjectDialog(props: EditProjectDialogProps) {
  const { open, setOpen, project, onFinish } = props;
  const { showSuccess, showError } = useMessage();

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Edit Project</DialogTitle>
      <Formik
        initialValues={project ?? {}}
        validate={values => {
          const errors: Record<string, string> = {};
          for (const [key, value] of Object.entries(values)) {
            if (!value) {
              errors[key] = "Required";
            }
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          updateProject(values as any)
            .then(() => {
              showSuccess("Successfully updated project");
              setOpen(false);
              onFinish();
            })
            .catch(error => showError(error.msg))
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
                  name="description"
                  label="Project Description"
                  helperText="Required"
                  required
                />
                <br />
                <Field
                  component={TextField}
                  variant="filled"
                  name="src"
                  label="Repo Src"
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
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submitForm}>Confirm</Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
