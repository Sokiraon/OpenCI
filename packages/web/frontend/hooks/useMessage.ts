import { useSnackbar } from "notistack";
import { useCallback } from "react";

export default function useMessage() {
  const { enqueueSnackbar } = useSnackbar();

  const showSuccess = useCallback(
    (message: string) => {
      enqueueSnackbar(message, {
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        autoHideDuration: 1500,
        variant: "success",
      });
    },
    [enqueueSnackbar]
  );

  const showError = useCallback(
    (message: string) => {
      enqueueSnackbar(message, {
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        autoHideDuration: 1500,
        variant: "error",
      });
    },
    [enqueueSnackbar]
  );

  return { showSuccess, showError };
}
