
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, userRole } = useAuth();
  
  useEffect(() => {
    if (!loading) {
      // Redirect based on authentication state and user role
      if (isAuthenticated) {
        navigate('/main');
      } else {
        // Redirect unauthenticated users to signin
        navigate('/signin');
      }
    }
  }, [navigate, isAuthenticated, loading, userRole]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Loading Application...</h1>
      </div>
    </div>
  );
};

export default Index;
