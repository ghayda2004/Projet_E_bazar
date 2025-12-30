import { useState, createContext, useCallback, useMemo, useEffect } from 'react';
import HomePage from './src/pages/HomePage';
import ProductsPage from './src/pages/ProductsPage';
import SellerDashboard from './src/pages/SellerDashboard';
import StoreProfilePage from './src/pages/StoreProfilePage';
import MyOrdersPage from './src/pages/MyOrdersPage';
import { getCurrentUser } from './src/services/authService';
import { Toast } from './src/components/Toast';

export type UserRole = 'client' | 'vendeur' | null;
export type CurrentPage = 'home' | 'products' | 'seller-dashboard' | 'store-profile' | 'my-orders';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sellerId?: string | number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemsCount: number;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => { },
  removeFromCart: () => { },
  clearCart: () => { },
  cartTotal: 0,
  cartItemsCount: 0,
  showToast: () => { },
});

// Helper to load cart from localStorage
const loadCart = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
};

// Helper to save cart to localStorage
const saveCart = (cart: CartItem[]) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

function App() {
  console.log("App component is rendering...");

  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [userName, setUserName] = useState<string>('User');
  const [selectedSellerId, setSelectedSellerId] = useState<number | string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  console.log("App state:", { userRole, isLoggedIn, currentPage });

  // Auto-login check on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = getCurrentUser();
        if (user && (user.role === 'client' || user.role === 'vendeur')) {
          setUserRole(user.role);
          setIsLoggedIn(true);
          setUserName(user.name);
          // Don't auto-navigate, stay on current page
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Don't show error to user on initial load
        // Clear any invalid stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    };

    checkAuth();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const handleLogin = (role: UserRole, username?: string) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setUserName(username || 'User');
    if (role === 'vendeur') {
      setCurrentPage('seller-dashboard');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Clear state
    setUserRole(null);
    setIsLoggedIn(false);
    setCurrentPage('home');
    setUserName('User');
    setCart([]); // Clear cart on logout
    localStorage.removeItem('cart');
  };

  const navigate = (page: CurrentPage, sellerId?: number | string) => {
    setCurrentPage(page);
    if (sellerId !== undefined) {
      setSelectedSellerId(sellerId);
    }
  };

  // useCallback hook - memoizes the addToCart function
  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((id: string | number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // useMemo hook - memoizes computed values
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const cartItemsCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
  }, []);

  const cartContextValue = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotal,
      cartItemsCount,
      showToast,
    }),
    [cart, addToCart, removeFromCart, clearCart, cartTotal, cartItemsCount, showToast]
  );

  return (
    <CartContext.Provider value={cartContextValue}>
      <div>
        {currentPage === 'home' && (
          <HomePage
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            userName={userName}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onNavigate={navigate}
            onOpenRegister={() => {
              if ((window as any).__openRegisterAsVendor) {
                (window as any).__openRegisterAsVendor();
              }
            }}
          />
        )}
        {currentPage === 'products' && (
          <ProductsPage
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            userName={userName}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onNavigate={navigate}
          />
        )}
        {currentPage === 'seller-dashboard' && userRole === 'vendeur' && (
          <SellerDashboard
            userName={userName}
            onLogout={handleLogout}
            onNavigate={navigate}
          />
        )}
        {currentPage === 'store-profile' && selectedSellerId && (
          <StoreProfilePage
            sellerId={selectedSellerId}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            userName={userName}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onNavigate={navigate}
            onBack={() => navigate('home')}
          />
        )}
        {currentPage === 'my-orders' && isLoggedIn && userRole === 'client' && (
          <MyOrdersPage
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            userName={userName}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onNavigate={navigate}
          />
        )}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </CartContext.Provider>
  );
}

export default App;
