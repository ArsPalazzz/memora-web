"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Alert, Snackbar } from "@mui/material";

interface Notification {
  id: number;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  open: boolean;
}

interface NotificationContextType {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  notifyInfo: (message: string) => void;
  notifyWarning: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, severity: Notification["severity"]) => {
      const id = Date.now();
      const newNotification = { id, message, severity, open: true };

      setNotifications((prev) => [...prev, newNotification]);

      // Удаляем через 4 секунды
      const timer = setTimeout(() => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, open: false } : n))
        );

        // Полностью удаляем из массива после анимации закрытия
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 300);
      }, 4000);

      // Очищаем таймер при размонтировании
      return () => clearTimeout(timer);
    },
    []
  );

  const removeNotification = useCallback((id: number) => {
    // Сначала скрываем
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, open: false } : n))
    );

    // Затем удаляем из массива
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 300);
  }, []);

  const handleClose = (id: number) => {
    removeNotification(id);
  };

  const api = {
    notifySuccess: (message: string) => addNotification(message, "success"),
    notifyError: (message: string) => addNotification(message, "error"),
    notifyInfo: (message: string) => addNotification(message, "info"),
    notifyWarning: (message: string) => addNotification(message, "warning"),
  };

  return (
    <NotificationContext.Provider value={api}>
      {children}

      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={notification.open}
          autoHideDuration={3000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: 2,
              boxShadow: 3,
            },
          }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.severity}
            variant="filled"
            sx={{
              width: "100%",
              color: "white",
              "& .MuiAlert-icon": {
                color: "white",
              },
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
