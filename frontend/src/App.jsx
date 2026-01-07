import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import SeekerDashboard from './pages/SeekerDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import ForgotCredentials from './pages/ForgotCredentials';
import ResetPassword from './pages/ResetPassword';
import Chat from './pages/Chat';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-credentials" element={<ForgotCredentials />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

        {/* Protected Redirect Root (Handles dashboard routing) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>

        {/* Role Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['SEEKER']} />}>
          <Route path="/seeker" element={<SeekerDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['BUSINESS']} />}>
          <Route path="/business" element={<BusinessDashboard />} />
        </Route>

        {/* Shared Protected Routes (Both Roles) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
        </Route>

      </Routes>
    </AuthProvider>
  );
}

export default App;
