import { DoDisturbOn, CheckCircle, Cancel, MoreHoriz } from "@mui/icons-material";
import {
  Box,
  BoxProps,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";
import { Job } from "@openci/core";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo, useState } from "react";
import { useProjectDetailContext } from ".";
import JobDetailDialog from "./JobDetailDialog";

const StatusCell = (props: BoxProps & { tip: string }) => (
  <Tooltip title={props.tip} placement="right">
    <Box
      sx={{
        width: 24,
        height: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      {...props}
    ></Box>
  </Tooltip>
);

export default function ProjectActivity() {
  const [jobToView, setJobToView] = useState<Job.Record>();
  const [openJobDetail, setOpenJobDetail] = useState(false);

  const { projectDetail, forceUpdate } = useProjectDetailContext();

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "status",
        headerName: "Status",
        width: 104,
        minWidth: 104,
        cellRenderer: (params: ICellRendererParams) => {
          switch (params.value) {
            case 0:
              return (
                <StatusCell tip="Running">
                  <CircularProgress disableShrink size={20} />
                </StatusCell>
              );
            case 1:
              return (
                <StatusCell tip="Cancelled">
                  <DoDisturbOn color="disabled" />
                </StatusCell>
              );
            case 2:
              return (
                <StatusCell tip="Success">
                  <CheckCircle color="success" />
                </StatusCell>
              );
            default:
              return (
                <StatusCell tip="Failure">
                  <Cancel color="error" />
                </StatusCell>
              );
          }
        },
      },
      { field: "id", headerName: "Job ID", width: 200 },
      { field: "createdAt", headerName: "Created At", flex: 2, sort: "desc" },
      { field: "updatedAt", headerName: "Updated At", flex: 3 },
      {
        headerName: "Actions",
        pinned: "right",
        sortable: false,
        width: 160,
        minWidth: 120,
        cellRenderer: (params: ICellRendererParams) => (
          <Tooltip title="Detail" placement="left">
            <IconButton
              onClick={() => {
                setJobToView(params.data);
                setOpenJobDetail(true);
              }}
            >
              <MoreHoriz />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      minWidth: 200,
      sortable: true,
      resizable: true,
    }),
    []
  );

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Paper className="ag-theme-material" sx={{ overflow: "hidden" }}>
          <AgGridReact
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowData={projectDetail?.jobs}
            domLayout="autoHeight"
            animateRows
            enableCellTextSelection
            pagination
            paginationPageSize={10}
          />
        </Paper>
      </Box>
      {jobToView && (
        <JobDetailDialog
          open={openJobDetail}
          setOpen={setOpenJobDetail}
          job={jobToView}
          project={projectDetail?.project}
          onFinish={() => forceUpdate()}
        />
      )}
    </>
  );
}
