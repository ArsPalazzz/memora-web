import { FormEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import WithBottomNav from "@/components/layout/WithBottomNav";
import { SectionLoader } from "@/components/ui/Loader";
import { useProtectedRequest } from "@/utils/protected";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendsRequest,
  getIncomingFriendRequestsRequest,
} from "@/services/friends/friends";
import { searchUsersByNicknameRequest } from "@/services/user/user";
import { FRIENDS, FRIENDS_REQUESTS, USER_SEARCH } from "@/routes/react-query";
import { ROUTES } from "@/routes/paths";
import { useNotification } from "@/context/NotificationContext";
import {
  NICKNAME_HINT,
  NICKNAME_PATTERN,
  NICKNAME_SEARCH_PREFIX_PATTERN,
} from "@/constants/nickname.const";

export default function FriendsClient() {
  const navigate = useNavigate();
  const { call } = useProtectedRequest();
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useNotification();
  const [searchNickname, setSearchNickname] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchNickname.trim().toLowerCase());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchNickname]);

  const canSearch =
    debouncedQuery.length >= 1 &&
    NICKNAME_SEARCH_PREFIX_PATTERN.test(debouncedQuery);

  const { data: searchResults = [], isFetching: isSearching } = useQuery({
    queryKey: [USER_SEARCH, debouncedQuery],
    queryFn: async () =>
      call((token) => searchUsersByNicknameRequest(debouncedQuery, token)),
    enabled: canSearch,
  });

  const { data: friends = [], isLoading: isFriendsLoading } = useQuery({
    queryKey: [FRIENDS],
    queryFn: async () => call((token) => getFriendsRequest(token)),
  });

  const { data: incomingRequests = [], isLoading: isRequestsLoading } =
    useQuery({
      queryKey: [FRIENDS_REQUESTS],
      queryFn: async () => call((token) => getIncomingFriendRequestsRequest(token)),
    });

  const invalidateFriends = () => {
    queryClient.invalidateQueries({ queryKey: [FRIENDS] });
    queryClient.invalidateQueries({ queryKey: [FRIENDS_REQUESTS] });
  };

  const acceptMutation = useMutation({
    mutationFn: (requesterSub: string) =>
      call((token) => acceptFriendRequest(requesterSub, token)),
    onSuccess: () => {
      notifySuccess("Friend request accepted");
      invalidateFriends();
    },
    onError: (err) => notifyError(err.message),
  });

  const declineMutation = useMutation({
    mutationFn: (requesterSub: string) =>
      call((token) => declineFriendRequest(requesterSub, token)),
    onSuccess: () => {
      notifySuccess("Friend request declined");
      invalidateFriends();
    },
    onError: (err) => notifyError(err.message),
  });

  const openProfile = (nickname: string) => {
    setSearchError(null);
    navigate(ROUTES.userProfile(nickname));
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const nickname = searchNickname.trim().toLowerCase();

    if (!NICKNAME_PATTERN.test(nickname)) {
      setSearchError(`Nickname: ${NICKNAME_HINT}`);
      return;
    }

    openProfile(nickname);
  };

  const isLoading = isFriendsLoading || isRequestsLoading;
  const isMutating = acceptMutation.isPending || declineMutation.isPending;
  const showSearchResults = canSearch;

  return (
    <WithBottomNav>
      <Header title="Friends" />

      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: 2, pt: 3, pb: 2 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            label="Find by nickname"
            placeholder="username"
            value={searchNickname}
            onChange={(event) => {
              setSearchNickname(event.target.value);
              if (searchError) setSearchError(null);
            }}
            error={!!searchError}
            helperText={searchError ?? "Start typing to see matching profiles"}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">@</InputAdornment>
                ),
                endAdornment: isSearching ? (
                  <InputAdornment position="end">
                    <CircularProgress size={16} />
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />

          {showSearchResults && (
            <Card variant="outlined" sx={{ mt: 1 }}>
              {searchResults.length === 0 && !isSearching ? (
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Typography variant="body2" color="text.secondary">
                    No profiles found
                  </Typography>
                </CardContent>
              ) : (
                searchResults.map((result) => (
                  <CardActionArea
                    key={result.sub}
                    onClick={() => openProfile(result.nickname)}
                  >
                    <CardContent
                      sx={{
                        py: 1,
                        "&:last-child": { pb: 1 },
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }} noWrap>
                        @{result.nickname}
                      </Typography>
                      <ChevronRightIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                    </CardContent>
                  </CardActionArea>
                ))
              )}
            </Card>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={<PersonSearchIcon />}
            sx={{ mt: 1.5 }}
          >
            Open profile
          </Button>
        </Box>

        {isLoading && <SectionLoader minHeight="30vh" />}

        {!isLoading && incomingRequests.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Incoming requests
            </Typography>
            <Stack spacing={1}>
              {incomingRequests.map((request) => (
                <Card key={request.sub} variant="outlined">
                  <CardContent
                    sx={{
                      py: 1.5,
                      "&:last-child": { pb: 1.5 },
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        fontWeight={700}
                        noWrap
                        sx={{ cursor: "pointer" }}
                        onClick={() => openProfile(request.nickname)}
                      >
                        @{request.nickname}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="contained"
                      disabled={isMutating}
                      onClick={() => acceptMutation.mutate(request.sub)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={isMutating}
                      onClick={() => declineMutation.mutate(request.sub)}
                    >
                      Decline
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

        {!isLoading && (
          <>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              My friends ({friends.length})
            </Typography>

            {friends.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <PeopleIcon sx={{ fontSize: 56, color: "grey.400", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No friends yet
                </Typography>
                <Typography color="text.secondary">
                  Find someone by nickname or add friends from public decks in
                  the feed.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1}>
                {friends.map((friend) => (
                  <Card key={friend.sub} variant="outlined">
                    <CardContent
                      sx={{
                        py: 1,
                        "&:last-child": { pb: 1 },
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                      }}
                      onClick={() => openProfile(friend.nickname)}
                    >
                      <Typography variant="body1" fontWeight={600} sx={{ flex: 1 }} noWrap>
                        @{friend.nickname}
                      </Typography>
                      <IconButton size="small" aria-label="Open profile">
                        <ChevronRightIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </>
        )}
      </Box>
    </WithBottomNav>
  );
}
