import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

interface DeleteProjectDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
}

export default function DeleteProjectDialog(props: DeleteProjectDialogProps) {
  const { open, setOpen, onConfirm } = props;

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Delete The Project?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          All data concerning the project, including configurations and activity
          history, will be removed accordingly.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
