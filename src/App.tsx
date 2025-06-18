import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { MenuItemPage } from './pages/MenuItemPage';
import { CartPage } from './pages/CartPage';
import { ProfilePage } from './pages/ProfilePage';
import { PaymentPage } from './pages/PaymentPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthPage } from './pages/AuthPage';
import { LikedItemsPage } from './pages/LikedItemsPage';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:id" element={<MenuItemPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/liked" element={<LikedItemsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster position="top-center" />
      </div>
    </AuthProvider>
  );
}

export default App;