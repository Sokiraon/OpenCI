import { ArrowBack, Delete, PlayArrow } from "@mui/icons-material";
import { Box, IconButton, Tab, Tabs, Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import DeleteProjectDialog from "../../components/DeleteProjectDialog";
import TextSkeleton from "../../components/TextSkeleton";
import useBarTitle from "../../hooks/useBarTitle";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useForceUpdate from "../../hooks/useForceUpdate";
import useMessage from "../../hooks/useMessage";
import { deleteProject, getProjectDetail } from "../../requests/project";
import StartJobDialog from "./StartJobDialog";
import { SecondaryBar } from "../Dashboard";
import { ProjectDetail } from "../../requests/type";

interface UrlParams extends Record<string, any> {
  id: number;
}

export function useProjectDetailContext() {
  return useOutletContext<{
    projectDetail: ProjectDetail | undefined;
    forceUpdate: () => void;
  }>();
}

export default function ProjectDetailPage() {
  useDocumentTitle("OpenCI - Project Detail");
  useBarTitle("Project Detail");

  const { showSuccess, showError } = useMessage();

  const { id } = useParams<UrlParams>();
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const [tabValue, setTabValue] = useState(pathname);
  useEffect(() => {
    setTabValue(pathname);
  }, [pathname]);

  const [projectDetail, setProjectDetail] = useState<ProjectDetail>();

  const forceUpdate = useForceUpdate(() => {
    if (id) {
      getProjectDetail(id).then(res => {
        setProjectDetail(res.data);
      });
    }
  }, [id]);

  const [openRun, setOpenRun] = useState(false);

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
      <SecondaryBar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => navigate("/projects")}
        >
          <ArrowBack />
        </IconButton>
        <TextSkeleton
          variant="h6"
          sx={{ minWidth: "144px", ml: 2 }}
          content={projectDetail?.project.name}
        />
        <Tabs
          textColor="inherit"
          value={tabValue}
          centered
          sx={{
            flex: 1,
            "& .MuiTabs-indicator": {
              background: "white",
            },
          }}
        >
          <Tab
            label="Activity"
            component={Link}
            value={`/projects/${id}/activity`}
            to={`/projects/${id}/activity`}
          />
          <Tab
            label="Config"
            component={Link}
            value={`/projects/${id}/config`}
            to={`/projects/${id}/config`}
          />
        </Tabs>
        <Box sx={{ display: "flex", columnGap: "8px", ml: 2, color: "white" }}>
          <Tooltip title="Start Job">
            <IconButton color="inherit" onClick={() => setOpenRun(true)}>
              <PlayArrow />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Project">
            <IconButton color="inherit" onClick={() => setOpenDelete(true)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </SecondaryBar>

      <Outlet context={{ projectDetail, forceUpdate }} />

      <StartJobDialog
        open={openRun}
        setOpen={setOpenRun}
        projectDetail={projectDetail}
        onFinish={() => forceUpdate()}
      />
      <DeleteProjectDialog
        open={openDelete}
        setOpen={setOpenDelete}
        onConfirm={handleDeleteProject}
      />
    </>
  );
}
