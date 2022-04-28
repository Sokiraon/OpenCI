import { Box, Button, MenuItem } from "@mui/material";
import React, { useMemo, useCallback } from "react";
import { Formik, Form, Field } from "formik";
import { Select, TextField } from "formik-mui";
import { Project } from "@openci/core";
import { RepoInfo } from "../../requests/type";

interface ProjectInfoStepProps {
  onBack: () => void;
  onProceed: (values: {
    name: string;
    description: string;
    defaultBranch: string;
  }) => void;
  curProjects: Project.Record[];
  repoInfo: RepoInfo;
}

export default function ProjectInfoStep(props: ProjectInfoStepProps) {
  const { onProceed, onBack, curProjects, repoInfo } = props;

  const initialValues = useMemo(
    () => ({
      name: "",
      description: "",
      defaultBranch: repoInfo.branches[0],
    }),
    [repoInfo.branches]
  );

  const validateForm = useCallback(
    (values: typeof initialValues) => {
      const errors: Partial<typeof initialValues> = {};
      if (!values.name) {
        errors.name = "Required";
      } else {
        if (curProjects.findIndex(project => project.name === values.name) !== -1) {
          errors.name = "Project name already exists";
        }
      }
      if (!values.description) {
        errors.description = "Required";
      }
      return errors;
    },
    [curProjects]
  );

  return (
    <Formik
      initialValues={initialValues}
      validate={validateForm}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        onProceed(values);
      }}
    >
      {({ submitForm }) => (
        <>
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "16px",
              width: "360px",
              marginTop: "8px",
            }}
          >
            <Field
              component={TextField}
              name="name"
              label="Project Name"
              required
              size="small"
            />
            <Field
              component={TextField}
              name="description"
              label="Project Description"
              required
              size="small"
              multiline
              rows={2}
            />
            <Field
              component={Select}
              name="defaultBranch"
              label="Default Branch"
              size="small"
            >
              {repoInfo.branches.map(branch => (
                <MenuItem value={branch} key={branch}>
                  {branch}
                </MenuItem>
              ))}
            </Field>
          </Form>
          <Box sx={{ display: "flex", columnGap: "8px", mt: 2 }}>
            <Button
              variant="contained"
              disableElevation
              onClick={() => submitForm()}
            >
              Proceed
            </Button>
            <Button variant="outlined" disableElevation onClick={onBack}>
              Back
            </Button>
          </Box>
        </>
      )}
    </Formik>
  );
}
