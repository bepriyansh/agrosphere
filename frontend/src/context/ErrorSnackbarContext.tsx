import React, { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type ErrorSnackbarContextType = {
  showError: (msg: string) => void;
};

const ErrorSnackbarContext = createContext<ErrorSnackbarContextType | undefined>(undefined);

export const useErrorSnackbar = () => {
  const ctx = useContext(ErrorSnackbarContext);
  if (!ctx) throw new Error("useErrorSnackbar must be used within ErrorSnackbarProvider");
  return ctx;
};

export const ErrorSnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const showError = (msg: string) => {
    setMessage(msg);
    setOpen(true);
  };

  return (
    <ErrorSnackbarContext.Provider value={{ showError }}>
      {children}
      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert severity="error" onClose={() => setOpen(false)} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </ErrorSnackbarContext.Provider>
  );
};