import { enqueueSnackbar, closeSnackbar } from "notistack";

export const notifySuccess = (message: string) =>
  enqueueSnackbar(message, { variant: "success" });

export const notifyError = (message: string) =>
  enqueueSnackbar(message, { variant: "error" });

export const notifyInfo = (message: string) =>
  enqueueSnackbar(message, { variant: "info" });

export { closeSnackbar };
