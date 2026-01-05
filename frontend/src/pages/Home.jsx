import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Home = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === 'BUSINESS') {
        return <Navigate to="/business" replace />;
    } else {
        return <Navigate to="/seeker" replace />;
    }
};

export default Home;
