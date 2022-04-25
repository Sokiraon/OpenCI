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
import { getJobLog } from "../../requests/job";
import { Prism } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Project, Job } from "@openci/core";

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
  job: Job.Record | undefined;
}

export default function JobDetailDialog(props: JobDetailDialogProps) {
  const { open, setOpen, project, job } = props;
  const { showError } = useMessage();

  const [jobLog, setJobLog] = useState<JobLog>();

  useEffect(() => {
    if (open) {
      getJobLog(job?.id ?? 0)
        .then(res => setJobLog(res.data))
        .catch(error => {
          showError(error.msg);
          setJobLog(undefined);
        });
    }
  }, [job?.id, open, showError]);

  const appBarColor = useMemo<MaterialColor>(() => {
    switch (job?.status) {
      case 1:
        return grey;
      case 2:
        return lightGreen;
      case 3:
        return red;
      default:
        return blue;
    }
  }, [job?.status]);

  const statusIcon = useMemo<React.ReactNode>(() => {
    switch (job?.status) {
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
  }, [job?.status]);

  const createdDate = useMemo(() => new Date(job?.createdAt ?? 0), [job?.createdAt]);
  const timeDelta = useMemo(
    () => (new Date(job?.updatedAt ?? 0).getTime() - createdDate.getTime()) / 1000,
    [createdDate, job?.updatedAt]
  );

  const handleDownload = useCallback(() => {
    try {
      const url = URL.createObjectURL(new Blob([jobLog?.content ?? ""]));
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = jobLog?.fileName ?? "";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showError("Failed to download file");
    }
  }, [jobLog, showError]);

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
            {project?.name} - {job?.id}
          </Typography>
          <IconButton color="inherit" onClick={() => setOpen(false)}>
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
            Log
          </Typography>
          {jobLog && (
            <Tooltip title="Download Log File">
              <IconButton onClick={handleDownload}>
                <Download />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        {jobLog && (
          <Prism language="bash" showLineNumbers style={nord}>
            {jobLog.content}
          </Prism>
        )}
      </Box>
    </Dialog>
  );
}
