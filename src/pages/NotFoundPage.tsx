import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-amber-600">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
          <p className="text-gray-600 mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-8 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
} 