import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { Select } from "formik-mui";
import React from "react";
import useMessage from "../../hooks/useMessage";
import { startJob } from "../../requests/job";
import { ProjectDetail } from "../../requests/type";

interface StartJobDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projectDetail: ProjectDetail | undefined;
  onFinish: () => void;
}

export default function StartJobDialog(props: StartJobDialogProps) {
  const { open, setOpen, projectDetail, onFinish } = props;
  const { showSuccess, showError } = useMessage();

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Start New Job</DialogTitle>
      <Formik
        initialValues={{ branch: projectDetail?.project.defaultBranch ?? "" }}
        onSubmit={values => {
          startJob({ projectId: projectDetail?.project.id ?? 0, options: values })
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
                Please specify a branch to work on (a default value has been given
                according to project configuration):
              </DialogContentText>
              <Form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "24px",
                }}
              >
                <Field component={Select} name="branch" label="Working Branch">
                  {projectDetail?.repoInfo.branches.map(branch => (
                    <MenuItem value={branch} key={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </Field>
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
