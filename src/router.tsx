import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FullPageLoader } from "@/components/ui/Loader";
import LoginClient from "@/components/login.client";
import SignUpClient from "@/components/sign-up";
import HomeClient from "@/components/home.client";
import ProfileClient from "@/components/profile.client";
import FeedClient from "@/components/feed.client";
import ReviewClient from "@/components/review.client";
import ReviewPlayClient from "@/components/reviewPlay.client";
import ArchivedDesksClient from "@/components/archived-desks.client";
import DeskClient from "@/components/desk.client";
import DeskCardsClient from "@/components/desk.cards.client";
import DeskPlayClient from "@/components/deskPlay.client";
import FolderClient from "@/components/folder-client";
import AnkiImportClient from "@/components/import/AnkiImport.client";
import PublicProfileClient from "@/components/publicProfile.client";
import PublicDeskClient from "@/components/publicDesk.client";
import AddFriendInviteClient from "@/components/addFriendInvite.client";
import FriendsLeagueClient from "@/components/friendsLeague.client";
import FriendsClient from "@/components/friends.client";
import WithBottomNav from "@/components/layout/WithBottomNav";
import Header from "@/components/layout/Header";
import { Box, Typography } from "@mui/material";

function InfoPage() {
  return (
    <WithBottomNav>
      <Header title="Info" />
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Профиль пользователя
        </Typography>
        <Typography color="text.secondary">
          Эта страница пока в разработке.
        </Typography>
        <Box id="profile-content" sx={{ mt: 2 }} />
      </Box>
    </WithBottomNav>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<LoginClient />} />
      <Route path="/sign-up" element={<SignUpClient />} />
      <Route path="/add" element={<AddFriendInviteClient />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/home"
          element={
            <Suspense fallback={<FullPageLoader />}>
              <HomeClient />
            </Suspense>
          }
        />
        <Route path="/profile" element={<ProfileClient />} />
        <Route path="/u/:nickname" element={<PublicProfileClient />} />
        <Route path="/u/:nickname/desk/:sub" element={<PublicDeskClient />} />
        <Route path="/desk/:id/public" element={<PublicDeskClient />} />
        <Route path="/feed" element={<FeedClient />} />
        <Route path="/friends/league" element={<FriendsLeagueClient />} />
        <Route path="/friends" element={<FriendsClient />} />
        <Route path="/info" element={<InfoPage />} />
        <Route
          path="/review"
          element={
            <Suspense fallback={<FullPageLoader />}>
              <ReviewClient />
            </Suspense>
          }
        />
        <Route path="/review/:id/play" element={<ReviewPlayClient />} />
        <Route path="/desk/archived" element={<ArchivedDesksClient />} />
        <Route path="/desk/:id" element={<DeskClient />} />
        <Route path="/desk/:id/cards" element={<DeskCardsClient />} />
        <Route path="/desk/:id/play" element={<DeskPlayClient />} />
        <Route path="/folder/:id" element={<FolderClient />} />
        <Route path="/import/anki" element={<AnkiImportClient />} />
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
