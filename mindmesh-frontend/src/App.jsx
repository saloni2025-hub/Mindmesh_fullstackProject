import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext.jsx';
import ProtectedRoute from './routes/ProtectRoute.jsx';
import MainLayout from './components/layout/MainLayout';
import LandingPage from './pages/landingpage.jsx';
import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';
import Onboarding from './features/onboarding/Onboarding';
import Dashboard from './features/dashboard/Dashboard';
import Discover from './features/discover/Discover';
import Messages from './features/messages/messages.jsx';
import Schedule from './features/schedule/Schedule';
import ProfilePage from './features/profile/ProfilePage';
import VerifyEmail from './features/auth/verifyEmail.jsx';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:chatId" element={<Messages />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;