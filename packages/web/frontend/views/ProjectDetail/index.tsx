import { ArrowBack, Delete, PlayArrow } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Skeleton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import DeleteProjectDialog from "../../components/DeleteProjectDialog";
import useBarTitle from "../../hooks/useBarTitle";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useForceUpdate from "../../hooks/useForceUpdate";
import useMessage from "../../hooks/useMessage";
import { deleteProject, getProjectDetail } from "../../requests/project";
import StartJobDialog from "./StartJobDialog";
import { SecondaryBar } from "../Dashboard";
import { ProjectDetail } from "../../requests/type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun } from "@fortawesome/free-solid-svg-icons/faSun";
import { faCloudSun } from "@fortawesome/free-solid-svg-icons";
import { faCloud } from "@fortawesome/free-solid-svg-icons";
import { faCloudRain } from "@fortawesome/free-solid-svg-icons";
import { faCloudBolt } from "@fortawesome/free-solid-svg-icons/faCloudBolt";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

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
  const healthInfo = useMemo<[IconDefinition, string] | undefined>(() => {
    if (projectDetail) {
      const finishedJobs = projectDetail.jobs.filter(job => job.status !== 0).length;
      const successJobs = projectDetail.jobs.filter(job => job.status === 2).length;
      const successRate = successJobs / finishedJobs;
      if (successRate <= 0.2) {
        return [faCloudBolt, "Less than 20% jobs successful"];
      } else if (successRate <= 0.4) {
        return [faCloudRain, "Less than 40% jobs successful"];
      } else if (successRate <= 0.6) {
        return [faCloud, "Less than 60% jobs successful"];
      } else if (successRate <= 0.8) {
        return [faCloudSun, "Less than 80% jobs successful"];
      } else {
        return [faSun, "More than 80% jobs successful"];
      }
    }
    return undefined;
  }, [projectDetail]);

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
        <Typography variant="h6" sx={{ minWidth: "128px", ml: 2 }}>
          {projectDetail && healthInfo ? (
            <>
              <Tooltip title={healthInfo[1]}>
                <Box>
                  {projectDetail.project.name}
                  <FontAwesomeIcon
                    fontSize={18}
                    icon={healthInfo[0]}
                    style={{ marginLeft: "16px" }}
                  />
                </Box>
              </Tooltip>
            </>
          ) : (
            <Skeleton height={40} />
          )}
        </Typography>
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
