import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Step,
  StepContent,
  StepLabel as MuiStepLabel,
  Stepper,
  styled,
  Typography,
} from "@mui/material";
import { Project } from "@openci/core";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { getProjectList } from "../../requests/project";
import { SecondaryBar } from "../Dashboard";
import ProjectInfoStep from "./ProjectInfoStep";
import SpecifyRepoStep from "./SpecifyRepoStep";
import SubmitFormStep from "./SubmitFormStep";

const StepLabel = styled(MuiStepLabel)({
  "& .MuiStepLabel-label": {
    fontSize: "18px",
  },
});

export default function CreateProject() {
  useDocumentTitle("OpenCI - Create Project");

  const navigate = useNavigate();

  const [projectList, setProjectList] = useState<Project.Record[]>([]);
  useEffect(() => {
    getProjectList().then(res => setProjectList(res.data));
  }, []);

  const [activeStep, setActiveStep] = useState(0);
  const stepBack = useCallback(() => setActiveStep(curStep => curStep - 1), []);
  const stepForward = useCallback(() => setActiveStep(curStep => curStep + 1), []);

  const [repoInfo, setRepoInfo] = useState<RepoInfo>({
    branches: ["master"],
    tags: [],
  });

  const [creationData, setCreationData] = useState<Project.Creation>({
    src: "",
    name: "",
    description: "",
    defaultBranch: "",
  });

  return (
    <>
      <SecondaryBar>
        <IconButton color="inherit" edge="start" onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 2 }}>
          Create Project
        </Typography>
      </SecondaryBar>
      <Box sx={{ p: 3 }}>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{ width: "90%", maxWidth: "720px", mx: "auto" }}
        >
          <Step>
            <StepLabel>Specify a Git Repository</StepLabel>
            <StepContent>
              <SpecifyRepoStep
                onProceed={({ src, repoInfo }) => {
                  setCreationData(curData => ({
                    ...curData,
                    src,
                  }));
                  setRepoInfo(repoInfo);
                  stepForward();
                }}
              />
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Enter Project Info</StepLabel>
            <StepContent>
              <ProjectInfoStep
                repoInfo={repoInfo}
                curProjects={projectList}
                onBack={() => stepBack()}
                onProceed={values => {
                  setCreationData(curData => ({
                    ...curData,
                    ...values,
                  }));
                  stepForward();
                }}
              />
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Checking...</StepLabel>
            <StepContent>
              <SubmitFormStep data={creationData} onBack={stepBack} />
            </StepContent>
          </Step>
        </Stepper>
      </Box>
    </>
  );
}
