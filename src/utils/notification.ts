import { enqueueSnackbar, closeSnackbar } from "notistack";

export const notifySuccess = (message: string, autoHideDuration = 2000) =>
  enqueueSnackbar(message, { variant: "success", autoHideDuration });

export const notifyError = (message: string) =>
  enqueueSnackbar(message, { variant: "error" });

export const notifyInfo = (message: string) =>
  enqueueSnackbar(message, { variant: "info" });

export { closeSnackbar };
