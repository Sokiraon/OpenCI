import { Box, Button, Typography } from "@mui/material";
import { Project } from "@openci/core";
import React, { useMemo, useState } from "react";
import { useProjectDetailContext } from ".";
import TextSkeleton from "../../components/TextSkeleton";
import EditProjectDialog from "./EditProjectDialog";

export default function ProjectConfig() {
  const { projectDetail, forceUpdate } = useProjectDetailContext();

  const [openEdit, setOpenEdit] = useState(false);

  const project = useMemo<Project.Creation>(
    () =>
      projectDetail?.project ?? {
        name: "",
        description: "",
        src: "",
        defaultBranch: "",
      },
    [projectDetail?.project]
  );

  const ProjectInfoItem = (props: {
    label: string;
    dataKey: keyof Project.Creation;
    formComponent?: React.ReactNode;
  }) => (
    <Box sx={{ display: "flex" }}>
      <Typography color="text.secondary" sx={{ width: "160px" }}>
        <strong>{props.label}</strong>
      </Typography>
      <TextSkeleton
        variant="body1"
        minWidth={128}
        content={project[props.dataKey]}
      />
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", columnGap: "8px", mb: 2 }}>
        <Button
          variant="contained"
          disableElevation
          disabled={projectDetail === undefined}
          onClick={() => setOpenEdit(true)}
        >
          Edit
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: "8px" }}>
        <ProjectInfoItem label="Project Name:" dataKey="name" />
        <ProjectInfoItem label="Description:" dataKey="description" />
        <ProjectInfoItem label="Repo Src:" dataKey="src" />
        <ProjectInfoItem label="Default Branch:" dataKey="defaultBranch" />
      </Box>
      <EditProjectDialog
        open={openEdit}
        setOpen={setOpenEdit}
        projectDetail={projectDetail}
        onFinish={() => forceUpdate()}
      />
    </Box>
  );
}
