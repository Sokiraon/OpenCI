import {
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Collapse,
  AlertTitle,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { verifyRepoUrl } from "../../requests/project";
import { RepoInfo } from "../../requests/type";

interface SpecifyRepoStepProps {
  onProceed: (values: { src: string; repoInfo: RepoInfo }) => void;
}

export default function SpecifyRepoStep(props: SpecifyRepoStepProps) {
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [repoInfo, setRepoInfo] = useState<RepoInfo>();
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setRepoInfo(undefined);
    setIsInvalid(false);
  }, [src]);

  const verifyUrl = useCallback(() => {
    setLoading(true);
    verifyRepoUrl({ url: src })
      .then(res => setRepoInfo(res.data))
      .catch(() => {
        setIsInvalid(true);
      })
      .finally(() => setLoading(false));
  }, [src]);

  return (
    <>
      <Typography gutterBottom>
        Enter your repository url in the textfield below, then click the "verify"
        button to proceed.
      </Typography>
      <Box sx={{ display: "flex", my: 2 }}>
        <TextField
          variant="outlined"
          label="Repository URL"
          size="small"
          sx={{ width: "400px" }}
          value={src}
          onChange={e => setSrc(e.target.value.trim())}
          disabled={loading}
        />
        <Button
          variant="contained"
          color="secondary"
          disableElevation
          sx={{ ml: 1 }}
          disabled={src.length === 0 || loading}
          onClick={verifyUrl}
        >
          Verify
        </Button>
      </Box>
      <Collapse in={repoInfo !== undefined || isInvalid} sx={{ width: 488 }}>
        {repoInfo && (
          <Alert severity="success" sx={{ border: "1px solid #4caf50" }}>
            You have specified a repo with{" "}
            <strong>{repoInfo?.branches.length}</strong> branches and{" "}
            <strong>{repoInfo?.tags.length}</strong> tags.
          </Alert>
        )}
        {isInvalid && (
          <Alert severity="error" sx={{ border: "1px solid #ef5350" }}>
            <AlertTitle>Failed to Verify URL</AlertTitle>
            Please make sure the url is valid and you have access to it.
          </Alert>
        )}
      </Collapse>
      <Button
        variant="contained"
        disableElevation
        disabled={repoInfo === undefined}
        sx={{ mt: 2 }}
        onClick={() => props.onProceed({ src, repoInfo: repoInfo! })}
      >
        Proceed
      </Button>
    </>
  );
}
