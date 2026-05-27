import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { AuthProvider } from './components/AuthContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import HomeFeed from './components/HomeFeed';
import SearchResults from './components/SearchResults';
import CreateReport from './components/CreateReport';
import MapView from './components/MapView';
import PostDetail from './components/PostDetail';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import ReunitedCases from './components/ReunitedCases';

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/feed" element={<HomeFeed />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/create-report" element={<CreateReport />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/reunited" element={<ReunitedCases />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
