import {
  Search,
  ShoppingCart,
  LogOut,
  Store,
  User,
  Lock,
  MessageCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useState, useContext } from 'react';
import type { UserRole, CurrentPage } from '../../App';
import { CartContext } from '../../App';
import { Badge } from './ui/badge';
import { login as loginAPI } from '../services/authService';
import RegisterForm from './RegisterForm';

interface HeaderProps {
  isLoggedIn: boolean;
  userRole: UserRole;
  userName?: string;
  onLogin: (role: UserRole, username?: string) => void;
  onLogout: () => void;
  onNavigate: (page: CurrentPage) => void;
  onRefreshSellers?: () => void;
}

export function Header({
  isLoggedIn,
  userRole,
  userName = 'John Buyer',
  onLogin,
  onLogout,
  onNavigate,
  onRefreshSellers,
}: HeaderProps) {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  const { cartItemsCount } = useContext(CartContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email || !password) {
      setLoginError('Veuillez remplir tous les champs');
      return;
    }

    if (!email.includes('@')) {
      setLoginError('Veuillez entrer une adresse email valide');
      return;
    }

    if (password.length < 4) {
      setLoginError('Le mot de passe doit contenir au moins 4 caractères');
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await loginAPI(email, password);
      onLogin(response.user.role as UserRole, response.user.name);
      setLoginDialogOpen(false);
      setEmail('');
      setPassword('');
      if (response.user.role === 'vendeur') {
        onNavigate('seller-dashboard');
      } else {
        onNavigate('products');
      }
    } catch (error: any) {
      setLoginError(error.message || 'Échec de la connexion');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => onLogout();
  const navigateToStore = () => userRole === 'vendeur' && onNavigate('seller-dashboard');

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* LEFT SIDE: Logo + Cart */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Logo */}
          <div
             className="flex items-center gap-2 cursor-pointer"
              onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img
                src="/images/logo-bz.png"
                 className="w-full h-full object-contain"
              />
            </div>
            <span className="text-slate-900 font-bold text-lg hidden sm:inline">
                  ElBazar
            </span>
          </div>

          {/* Cart */}
          <button
            onClick={() => {
              if (isLoggedIn) {
                onNavigate('my-orders');
              } else {
                alert('Connectez-vous pour voir votre panier');
              }
            }}
            className="relative p-2 text-gray-700 hover:text-slate-800 hover:bg-gray-100 rounded-lg transition"
            title="Mon Panier"
          >
            <ShoppingCart size={24} />
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white rounded-full">
                {cartItemsCount}
              </Badge>
            )}
          </button>
        </div>

        {/* CENTER: Search */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher des produits..."
              className="pl-10 bg-gray-50 border-gray-200 rounded-lg w-full"
            />
          </div>
        </div>

        {/* RIGHT SIDE: Chatbot + Auth */}
        <div className="flex items-center gap-3">
          {/* Chatbot */}
          <button
            onClick={() => onNavigate('chatbot')}
            className="p-2 text-gray-600 hover:text-slate-800 hover:bg-gray-100 rounded-lg transition"
            title="Ouvrir le chatbot Zaraa"
          >
            <MessageCircle size={22} />
          </button>

          {/* Auth Section */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              {userRole === 'vendeur' && (
                <Button
                  variant="ghost"
                  className="gap-2 hidden sm:flex"
                  onClick={navigateToStore}
                >
                  <Store className="w-4 h-4" />
                  Ma Boutique
                </Button>
              )}
              <span className="text-gray-700 hidden sm:inline text-sm font-medium">
                {userName}
              </span>
              <Button variant="outline" className="gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          ) : (
            <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-slate-700 hover:bg-slate-800 gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Connexion</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Connexion</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" /> Email
                    </label>
                    <Input
                      type="email"
                      placeholder="exemple@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoggingIn}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Mot de passe
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoggingIn}
                    />
                  </div>

                  {loginError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                      {loginError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className={`w-full gap-2 transition-all duration-300 ${
                      isLoggingIn
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-slate-700 hover:bg-slate-800'
                    }`}
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Connexion en cours...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    Pas encore de compte ?{' '}
                    <span
                      onClick={() => {
                        setLoginDialogOpen(false);
                        setRegisterDialogOpen(true);
                      }}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      S'inscrire
                    </span>
                  </p>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-5">
          <DialogHeader>
            <DialogTitle className="text-xl">Créer un compte</DialogTitle>
          </DialogHeader>
          <RegisterForm
            onRegister={(userData) => {
              setRegisterDialogOpen(false);
              if (userData.role === 'vendeur' && onRefreshSellers) {
                onRefreshSellers();
              }
              onLogin(userData.role as UserRole, userData.name);
              if (userData.role === 'vendeur') {
                onNavigate('seller-dashboard');
              } else {
                onNavigate('products');
              }
            }}
            onNavigate={() => {}}
          />
        </DialogContent>
      </Dialog>
    </header>
  );
}
