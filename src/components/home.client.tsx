"use client";

import {
  Typography,
  Box,
  CardContent,
  Card,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import { useAuth } from "../utils/auth";
import BottomNav from "./layout/BottomNav";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDeskRequest, fetchMyDesksRequest } from "../services/desk/desk";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import NewDeskModal from "@/components/modals/NewDesk/NewDesk.modal";
import {
  createDeskSchema,
  CreateDeskValues,
} from "@/schemas/createDesk.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifyError, notifySuccess } from "@/utils/notification";
import { useAuthContext } from "@/context/AuthContext";
import { USER_DESKS } from "@/routes/react-query";
import { CreateDeskResult } from "@/services/desk/desk.types";
import { useProtectedRequest } from "@/utils/protected";
import { FullPageLoader, Loader } from "@/components/ui/Loader";
import Header from "@/components/layout/Header";
import { v4 as uuidV4 } from "uuid";
import { useRouter, useSearchParams } from "next/navigation";
import { getMyProfileRequest } from "@/services/user/user";

export default function HomeClient() {
  const { loading, authenticated } = useAuth();
  const { accessToken } = useAuthContext();
  const queryClient = useQueryClient();
  const { call } = useProtectedRequest();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const { data: desks, isLoading: isDesksLoading } = useQuery({
    queryKey: [USER_DESKS],
    queryFn: async () => call((token) => fetchMyDesksRequest(token)),
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateDeskValues>({
    resolver: zodResolver(createDeskSchema),
    mode: "onChange",
  });

  const createDeskMutation = useMutation({
    mutationFn: (payload: { data: CreateDeskValues; token: string }) => {
      const sub = uuidV4();
      const data = { sub, ...payload.data };

      return call(() => createDeskRequest(data, payload.token));
    },
    onSuccess: (payload: CreateDeskResult) => {
      reset();
      setOpen(false);
      notifySuccess(`Desk '${payload.title}' created successfully`);

      queryClient.invalidateQueries({ queryKey: [USER_DESKS] });
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const onSubmit = (data: CreateDeskValues) => {
    //if (!accessToken) return notifyError("User is not authorized");

    createDeskMutation.mutate({ data, token: accessToken! });
  };

  if (isDesksLoading) return <FullPageLoader />;

  if (!authenticated) return null;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Header
          title="Desks"
          RightButton={
            <IconButton onClick={() => setOpen(true)}>
              <AddIcon sx={{ color: "white", fontSize: 30 }} />
            </IconButton>
          }
        />

        <Box sx={{ overflowY: "auto" }}>
          {isDesksLoading && <Loader />}

          <Grid container spacing={2} sx={{ pt: 2, px: 2 }}>
            {!desks?.length && (
              <Box
                sx={{
                  width: "100%",
                  height: "calc(100vh - 2 * 8vh)",
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ display: "inline" }}>
                  You don&apos;t have any desks yet.{" "}
                  <Box
                    component="span"
                    sx={{
                      cursor: "pointer",
                      color: "#5961d3",
                      fontWeight: 700,
                    }}
                    onClick={() => setOpen(true)}
                  >
                    Add one?
                  </Box>
                </Typography>
              </Box>
            )}

            {desks &&
              desks.map((desk) => (
                <Grid size={{ xs: 12, sm: 6 }} key={desk.sub}>
                  <Card
                    variant="outlined"
                    sx={{
                      transition: "0.3s",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => router.push(`desk/${desk.sub}`)}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        mb={0.5}
                        sx={{ lineHeight: 1.2 }}
                      >
                        {desk.title}
                      </Typography>

                      {desk.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1.5}
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {desk.description}
                        </Typography>
                      )}

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ opacity: 0.8 }}
                      >
                        Created {new Date(desk.created_at).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>

        <BottomNav />
      </Box>

      {open && (
        <NewDeskModal
          open={open}
          onClose={() => setOpen(false)}
          errors={errors}
          register={register}
          onSubmit={handleSubmit(onSubmit)}
        />
      )}
    </>
  );
}
