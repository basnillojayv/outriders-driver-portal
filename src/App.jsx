import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Admin pages
import AdminLayout from '@/components/admin/AdminLayout.jsx';
import AdminDashboard from '@/pages/admin/Dashboard';
import DriverList from '@/pages/admin/DriverList';
import CSVImport from '@/pages/admin/CSVImport';
import DriverDetail from '@/pages/admin/DriverDetail';
import MembersTable from '@/pages/admin/MembersTable';
import MemberDetail from '@/pages/admin/MemberDetail';
import MemberUpdates from '@/pages/admin/MemberUpdates';
import Settings from '@/pages/admin/Settings';

import CreateUsers from '@/pages/admin/CreateUsers';
import Inbox from '@/pages/admin/Inbox';
import VoiceConfig from '@/pages/admin/VoiceConfig';
import Events from '@/pages/admin/Events';
import OneHomeLeads from '@/pages/admin/OneHomeLeads';
import ActivityLog from '@/pages/admin/ActivityLog';

// Driver portal pages
import DriverLayout from '@/components/driver/DriverLayout.jsx';
import DriverHome from '@/pages/driver/DriverHome';
import Locations from '@/pages/driver/Locations.jsx';
import Rewards from '@/pages/driver/Rewards.jsx';
import MemberCardPage from '@/pages/driver/MemberCardPage';
import AccountSettings from '@/pages/driver/AccountSettings';
import HomeV3 from '@/pages/driver/HomeV3';
import CareerCenter from '@/pages/driver/CareerCenter';
import FindMembers from '@/pages/driver/FindMembers';
import DriverPassport from '@/pages/driver/DriverPassport';
import PassportEdit from '@/pages/driver/PassportEdit';
import ComingSoonPage from '@/pages/driver/ComingSoonPage';
import EventCalendar from '@/pages/driver/EventCalendar';
import Channel19 from '@/pages/driver/Channel19';
import FleetServices from '@/pages/driver/FleetServices';
import AmenityReservations from '@/pages/driver/AmenityReservations';
import GearShop from '@/pages/driver/GearShop';
import CabClass from '@/pages/driver/CabClass';
import LuluChat from '@/pages/driver/LuluChat';
import OneHome from '@/pages/driver/OneHome';
import FlexSpace from '@/pages/driver/FlexSpace';
import SharePage from '@/pages/driver/SharePage';

// Public
import Activation from '@/pages/Activation';
import Welcome from '@/pages/Welcome';
import JoinOutriders from '@/pages/JoinOutriders';
import ActivateProfile from '@/pages/ActivateProfile';
import JoinOneHome from '@/pages/JoinOneHome';
import PublicPassport from '@/pages/PublicPassport';

/**
 * Single-page mode — `VITE_REWARDS_ONLY=true` at build time (see vercel.json).
 * Every path renders the Founders/Rewards page and nothing is auth-gated, so
 * the standalone deploy can't bounce visitors to a login it has no backend for.
 * Pair it with VITE_DEMO_MODE=true, which feeds the page its stub data.
 */
const REWARDS_ONLY = import.meta.env.VITE_REWARDS_ONLY === 'true';

function RewardsOnlyApp() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="*" element={<Rewards />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

function App() {
  if (REWARDS_ONLY) return <RewardsOnlyApp />;

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            {/* Public auth pages — no auth required */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Public join pages — no auth required */}
            <Route path="/join/outriders" element={<JoinOutriders />} />
            <Route path="/join/onehome" element={<JoinOneHome />} />
            <Route path="/passport/:userId" element={<PublicPassport />} />

            {/* All app routes require auth */}
            <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
              {/* Admin portal */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="members" element={<MembersTable />} />
                <Route path="members/:id" element={<MemberDetail />} />
                <Route path="member-updates" element={<MemberUpdates />} />
                <Route path="import" element={<CSVImport />} />
                <Route path="driver/:id" element={<DriverDetail />} />

                <Route path="create-users" element={<CreateUsers />} />
                <Route path="inbox" element={<Inbox />} />
                <Route path="voice" element={<VoiceConfig />} />
                <Route path="events" element={<Events />} />
                <Route path="onehome-leads" element={<OneHomeLeads />} />
                <Route path="activity-log" element={<ActivityLog />} />
                <Route path="support" element={<Settings />} />
              </Route>

              {/* Legacy driver portal (wrapped in DriverLayout chrome) */}
              <Route element={<DriverLayout />}>
                <Route path="/old-home" element={<DriverHome />} />
              </Route>

              {/* First-release V3 pages (standalone, V3Shell) */}
              <Route path="/" element={<HomeV3 />} />
              <Route path="/member-card" element={<MemberCardPage />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/career-center" element={<CareerCenter />} />
              <Route path="/find-members" element={<FindMembers />} />
              <Route path="/digital-passport" element={<DriverPassport />} />
              <Route path="/digital-passport/edit" element={<PassportEdit />} />
              <Route path="/fleet-services" element={<FleetServices />} />
              <Route path="/amenity-reservations" element={<AmenityReservations />} />
              <Route path="/channel-19" element={<Channel19 />} />
              <Route path="/gear-shop" element={<GearShop />} />
              <Route path="/resy" element={<ComingSoonPage title="Resy" description="Reservations and bookings for Outriders amenities and partner locations. In the works." />} />
              <Route path="/cab-class" element={<CabClass />} />
              <Route path="/events" element={<EventCalendar />} />
            <Route path="/lulu" element={<LuluChat />} />
            <Route path="/onehome" element={<OneHome />} />
            <Route path="/flex-space" element={<FlexSpace />} />
            <Route path="/share" element={<SharePage />} />
              <Route path="/settings" element={<AccountSettings />} />

              {/* Private pages */}
              <Route path="/activate" element={<ActivateProfile />} />
              <Route path="/welcome" element={<Welcome />} />

              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App