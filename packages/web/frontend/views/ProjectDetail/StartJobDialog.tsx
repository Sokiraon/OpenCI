import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Project } from "@openci/core";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import React from "react";
import useMessage from "../../hooks/useMessage";
import { startJob } from "../../requests/job";

interface StartJobDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  project: Project.Record | undefined;
  onFinish: () => void;
}

export default function StartJobDialog(props: StartJobDialogProps) {
  const { open, setOpen, project, onFinish } = props;
  const { showSuccess, showError } = useMessage();

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Start New Job</DialogTitle>
      <Formik
        initialValues={{ branch: "", input: "" }}
        onSubmit={values => {
          startJob({ projectId: project?.id ?? 0, options: values })
            .then(() => {
              showSuccess("Successfully started new job");
              setOpen(false);
              onFinish();
            })
            .catch(error => {
              showError(error.msg);
              setOpen(false);
            });
        }}
      >
        {({ submitForm }) => (
          <>
            <DialogContent>
              <DialogContentText>
                Before a new job is started, you may specify some options listed
                below:
              </DialogContentText>
              <Form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "16px",
                  marginTop: "32px",
                }}
              >
                <Field
                  component={TextField}
                  variant="filled"
                  name="branch"
                  label="Working Branch"
                  placeholder={project?.defaultBranch ?? ""}
                />
                <Field
                  component={TextField}
                  variant="filled"
                  name="input"
                  label="CIFile Path (relative to project root)"
                  placeholder="./CIFile"
                />
              </Form>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submitForm}>Start</Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
