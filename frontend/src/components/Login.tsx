import { User, Lock, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useState, useEffect } from 'react';
import type { UserRole, CurrentPage } from '../../App';
import { login as loginAPI } from '../services/authService';

interface LoginProps {
  onLogin: (role: UserRole, username?: string) => void;
  onNavigate: (page: CurrentPage) => void;
  onOpenRegister?: () => void;
}

export function Login({ onLogin, onNavigate, onOpenRegister }: LoginProps) {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    // Validation
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
    
    // Real login with backend API
    setIsLoggingIn(true);
    try {
      const response = await loginAPI(email, password);
      
      // Call parent login handler with user data
      onLogin(response.user.role as UserRole, response.user.name);
      
      setLoginDialogOpen(false);
      setEmail('');
      setPassword('');
      
      // Redirect based on user role
      if (response.user.role === 'vendeur') {
        onNavigate('seller-dashboard');
      } else {
        onNavigate('home');
      }
    } catch (error: any) {
      setLoginError(error.message || 'Échec de la connexion');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setLoginDialogOpen(open);
    if (!open) {
      // Reset state when dialog closes
      setTimeout(() => {
        setEmail('');
        setPassword('');
        setLoginError('');
      }, 300);
    }
  };

  const handleOpenRegister = () => {
    setLoginDialogOpen(false);
    if (onOpenRegister) {
      onOpenRegister();
    }
  };

  // Expose function to open login dialog from outside
  useEffect(() => {
    (window as any).__openLogin = () => {
      setLoginDialogOpen(true);
    };
    return () => {
      delete (window as any).__openLogin;
    };
  }, []);

  return (
    <Dialog open={loginDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button className="bg-slate-700 hover:bg-slate-800">
          Connexion
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Connexion</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="login-email" className="text-sm flex items-center gap-2">
              <User className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoggingIn}
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="login-password" className="text-sm flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Mot de passe
            </Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoggingIn}
              autoComplete="current-password"
            />
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {loginError}
            </div>
          )}

          <Button 
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-800"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Pas encore de compte?{' '}
              <button
                type="button"
                onClick={handleOpenRegister}
                className="text-slate-700 font-medium hover:underline"
              >
                S'inscrire
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

