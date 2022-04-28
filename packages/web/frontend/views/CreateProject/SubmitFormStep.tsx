import { Box, Button, Divider, Typography } from "@mui/material";
import { Project } from "@openci/core";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useMessage from "../../hooks/useMessage";
import { createProject } from "../../requests/project";

const TableItem = (props: { label: string; value: string }) => (
  <>
    <Typography>
      <strong>{props.label}</strong>
    </Typography>
    <Typography sx={{ overflowWrap: "break-word" }}>{props.value}</Typography>
  </>
);

interface SubmitFormStepProps {
  onBack: () => void;
  data: Project.Creation;
}

export default function SubmitFormStep(props: SubmitFormStepProps) {
  const { onBack, data } = props;
  const { showError, showSuccess } = useMessage();
  const navigate = useNavigate();

  const submit = useCallback(() => {
    createProject(data)
      .then(() => {
        showSuccess("Succesfully created project");
        navigate("/projects");
      })
      .catch(() => {
        showError("Failed to create project");
      });
  }, [data, navigate, showError, showSuccess]);

  return (
    <>
      <Typography>Details about the project to be created:</Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "160px 320px",
          my: 1,
          rowGap: "8px",
        }}
      >
        <Divider sx={{ gridColumn: "1 / 3" }} />
        <TableItem label="Repo Src:" value={data.src} />
        <TableItem label="Project Name:" value={data.name} />
        <TableItem label="Description:" value={data.description} />
        <TableItem label="Default Branch:" value={data.defaultBranch} />
        <Divider sx={{ gridColumn: "1 / 3" }} />
      </Box>
      <Typography>
        Click the "submit" button to proceed, or return to previous steps to edit.
      </Typography>
      <Box sx={{ display: "flex", columnGap: "8px", mt: 3 }}>
        <Button variant="contained" disableElevation onClick={submit}>
          Submit
        </Button>
        <Button variant="outlined" disableElevation onClick={onBack}>
          Back
        </Button>
      </Box>
    </>
  );
}
