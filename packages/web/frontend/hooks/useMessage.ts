import { useSnackbar } from "notistack";

export default function useMessage() {
  const { enqueueSnackbar } = useSnackbar();

  return {
    showSuccess: (message: string) => {
      enqueueSnackbar(message, {
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        autoHideDuration: 2500,
        variant: "success",
      });
    },
    showError: (message: string) => {
      enqueueSnackbar(message, {
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        autoHideDuration: 2500,
        variant: "error",
      });
    },
  };
}
