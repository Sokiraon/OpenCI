import {
  AccessTime,
  Cancel,
  CheckCircle,
  Close,
  DoDisturbOn,
  Download,
  Timelapse,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { blue, grey, lightGreen, red } from "@mui/material/colors";
import { TransitionProps } from "@mui/material/transitions";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useMessage from "../../hooks/useMessage";
import { Prism } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Project, Job } from "@openci/core";
import { getJobDetail, JobDetail } from "../../requests/job";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface JobDetailDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  project: Project.Record | undefined;
  job: Job.Record;
  onFinish: () => void;
}

export default function JobDetailDialog(props: JobDetailDialogProps) {
  const { open, setOpen, project, job, onFinish } = props;
  const { showError } = useMessage();

  const [jobDetail, setJobDetail] = useState<JobDetail>();
  const jobInfo = useMemo(() => jobDetail?.info ?? job, [job, jobDetail?.info]);

  const handleCloseDialog = useCallback(() => {
    setOpen(false);
    setJobDetail(undefined);
    onFinish();
  }, [onFinish, setOpen]);

  const fetchJobData = useCallback<() => Promise<JobDetail>>(
    () =>
      new Promise(resolve => {
        getJobDetail(jobInfo.id)
          .then(res => resolve(res.data))
          .catch(error => {
            showError(error.msg);
            setJobDetail(undefined);
          });
      }),
    [jobInfo.id, showError]
  );

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (open) {
      fetchJobData().then(data => {
        if (data.log.running) {
          intervalId = setInterval(() => {
            fetchJobData().then(data => {
              if (!data.log.running) {
                clearInterval(intervalId);
              }
              setJobDetail(data);
            });
          }, 1000);
        }
        setJobDetail(data);
      });
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobInfo.id, open, fetchJobData]);

  const appBarColor = useMemo<MaterialColor>(() => {
    switch (jobInfo.status) {
      case 1:
        return grey;
      case 2:
        return lightGreen;
      case 3:
        return red;
      default:
        return blue;
    }
  }, [jobInfo.status]);

  const statusIcon = useMemo<React.ReactNode>(() => {
    switch (jobInfo.status) {
      case 1:
        return <DoDisturbOn />;
      case 2:
        return <CheckCircle />;
      case 3:
        return <Cancel />;
      default:
        return (
          <CircularProgress
            disableShrink
            size={20}
            color="inherit"
            sx={{ ml: "2px" }}
          />
        );
    }
  }, [jobInfo.status]);

  const createdDate = useMemo(() => new Date(jobInfo.createdAt ?? 0), [jobInfo]);
  const timeDelta = useMemo(
    () => (new Date(jobInfo.updatedAt).getTime() - createdDate.getTime()) / 1000,
    [createdDate, jobInfo]
  );

  const handleDownload = useCallback(() => {
    if (jobDetail) {
      try {
        const url = URL.createObjectURL(new Blob([jobDetail.log.content]));
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = jobDetail.log.fileName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        showError("Failed to download file");
      }
    }
  }, [jobDetail, showError]);

  return (
    <Dialog fullScreen open={open} TransitionComponent={Transition}>
      <AppBar sx={{ position: "relative", bgcolor: appBarColor[700] }} elevation={0}>
        <Toolbar variant="dense">
          <Box
            sx={{ width: "24px", ml: "-2px", display: "flex", alignItems: "center" }}
          >
            {statusIcon}
          </Box>
          <Typography variant="h6" sx={{ flex: 1, ml: 1.5 }}>
            {project?.name} - {jobInfo.id}
          </Typography>
          <IconButton color="inherit" onClick={handleCloseDialog}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          bgcolor: appBarColor[600],
          px: 3,
          py: 2,
          display: "flex",
          flexWrap: "wrap",
          columnGap: "48px",
        }}
        color="white"
      >
        <Tooltip title="Started Time">
          <Box sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
            <AccessTime sx={{ fontSize: 16 }} />
            <Typography variant="body2">{createdDate.toLocaleString()}</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="Total Length">
          <Box sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
            <Timelapse sx={{ fontSize: 16 }} />
            <Box sx={{ display: "flex", columnGap: "4px" }}>
              {timeDelta >= 3600 && (
                <Typography variant="body2">
                  {Math.trunc(timeDelta / 3600)}h
                </Typography>
              )}
              {timeDelta % 3600 >= 60 && (
                <Typography variant="body2">
                  {Math.trunc((timeDelta % 3600) / 60)}m
                </Typography>
              )}
              <Typography variant="body2">{timeDelta % 60}s</Typography>
            </Box>
          </Box>
        </Tooltip>
      </Box>
      <Box
        sx={{
          maxHeight: "80%",
          px: 3,
          py: 2,
          fontSize: "13px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", columnGap: "8px" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Execution Log
          </Typography>
          {jobDetail && (
            <Tooltip title="Download Log File">
              <IconButton onClick={handleDownload}>
                <Download />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        {jobDetail && (
          <Prism language="bash" showLineNumbers style={nord}>
            {jobDetail.log.content}
          </Prism>
        )}
      </Box>
    </Dialog>
  );
}
