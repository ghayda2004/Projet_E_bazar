import { Search, ShoppingCart, LogOut, Store, X, Trash2, Package, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useState, useContext } from 'react';
import type { UserRole, CurrentPage } from '../../App';
import { CartContext } from '../../App';
import { Badge } from './ui/badge';
import { createOrder } from '../services/orderService';
import RegisterForm from './RegisterForm';
import { Login } from './Login';

interface HeaderProps {
  isLoggedIn: boolean;
  userRole: UserRole;
  userName?: string;
  showCart?: boolean;
  onLogin: (role: UserRole, username?: string) => void;
  onLogout: () => void;
  onNavigate: (page: CurrentPage) => void;
  onRefreshSellers?: () => void;
  onOpenRegisterAsVendor?: () => void;
}

export function Header({ isLoggedIn, userRole, userName = 'John Buyer', showCart = false, onLogin, onLogout, onNavigate, onRefreshSellers, onOpenRegisterAsVendor }: HeaderProps) {
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [registerAsVendor, setRegisterAsVendor] = useState(false);
  
  // useContext hook - access cart data
  const { cart, removeFromCart, clearCart, cartTotal, cartItemsCount, showToast } = useContext(CartContext);

  const handleLogout = () => {
    onLogout();
  };

  // Expose function to parent to open register dialog as vendor
  if (onOpenRegisterAsVendor && !isLoggedIn) {
    (window as any).__openRegisterAsVendor = () => {
      setRegisterAsVendor(true);
      setRegisterDialogOpen(true);
    };
  }

  const handleOpenRegister = () => {
    setRegisterDialogOpen(true);
  };

  const navigateToStore = () => {
    if (userRole === 'vendeur') {
      onNavigate('seller-dashboard');
    }
  };

  const handleChatbotClick = () => {
    onNavigate('chatbot');
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast('Votre panier est vide', 'warning');
      return;
    }

    if (!isLoggedIn) {
      showToast('Veuillez vous connecter pour passer commande', 'warning');
      setCartDialogOpen(false);
      // Open login dialog programmatically
      if ((window as any).__openLogin) {
        (window as any).__openLogin();
      }
      return;
    }

    try {
      const items = cart.map(item => ({
        productId: String(item.id),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        sellerId: item.sellerId ? String(item.sellerId) : undefined,
      }));

      await createOrder(items);
      clearCart();
      setCartDialogOpen(false);
      showToast('Commande passée avec succès! 🎉', 'success');
      setTimeout(() => {
        onNavigate('my-orders');
      }, 1500);
    } catch (error: any) {
      showToast(error.message || 'Erreur lors de la commande', 'error');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-6 h-6 bg-slate-700 transform rotate-45" />
          <span className="text-slate-900">Elbazare</span>
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher des produits..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Chatbot Icon - Always visible */}
          <button 
            type="button"
            onClick={handleChatbotClick}
            className="text-gray-600 hover:text-slate-700 transition-colors relative group"
            title="Assistant Chatbot"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {(showCart || cartItemsCount > 0 || (isLoggedIn && userRole === 'client')) && (
            <Dialog open={cartDialogOpen} onOpenChange={setCartDialogOpen}>
              <DialogTrigger asChild>
                <button type="button" aria-label="Ouvrir le panier" className="text-gray-600 hover:text-gray-900 relative">
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-500">
                      {cartItemsCount}
                    </Badge>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Panier ({cartItemsCount} articles)</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Votre panier est vide</p>
                  ) : (
                    <>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <p className="text-sm text-gray-500">
                                ${item.price.toFixed(2)} x {item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold">Total:</span>
                          <span className="text-xl font-bold text-green-600">
                            ${cartTotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1 gap-2"
                            onClick={clearCart}
                          >
                            <Trash2 className="w-4 h-4" />
                            Vider
                          </Button>
                          <Button 
                            className="flex-1 bg-slate-700 hover:bg-slate-800"
                            onClick={handleCheckout}
                          >
                            Commander
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {userRole === 'vendeur' && (
                <Button 
                  variant="ghost" 
                  className="gap-2"
                  onClick={navigateToStore}
                >
                  <Store className="w-4 h-4" />
                  Ma Boutique
                </Button>
              )}
              {userRole === 'client' && (
                <Button 
                  variant="ghost" 
                  className="gap-2"
                  onClick={() => onNavigate('my-orders')}
                >
                  <Package className="w-4 h-4" />
                  Mes commandes
                </Button>
              )}
              <span className="text-gray-700">{userName}</span>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </div>
          ) : (
            <Login 
              onLogin={onLogin}
              onNavigate={onNavigate}
              onOpenRegister={handleOpenRegister}
            />
          )}

          {/* Registration Dialog */}
          <Dialog open={registerDialogOpen} onOpenChange={(open: boolean ) => {
            setRegisterDialogOpen(open);
            if (!open) {
              setRegisterAsVendor(false);
            }
          }}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg">Créer un compte</DialogTitle>
              </DialogHeader>
              <div className="py-2">
                <RegisterForm 
                  defaultRole={registerAsVendor ? 'vendeur' : 'client'}
                  onRegister={(userData) => {
                    setRegisterDialogOpen(false);
                    setRegisterAsVendor(false);
                    // Refresh sellers list if a seller was registered
                    if (userData.role === 'vendeur' && onRefreshSellers) {
                      onRefreshSellers();
                    }
                    // Auto-login the user after registration
                    // handleLogin in App.tsx already handles navigation based on role
                    onLogin(userData.role as UserRole, userData.name);
                  }}
                  onNavigate={() => {}}
                  onOpenLogin={() => {
                    setRegisterDialogOpen(false);
                    setRegisterAsVendor(false);
                    // Open login dialog programmatically
                    if ((window as any).__openLogin) {
                      (window as any).__openLogin();
                    }
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}