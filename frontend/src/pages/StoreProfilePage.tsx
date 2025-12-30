import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { useState, useEffect, useContext } from 'react';
import type { UserRole, CurrentPage } from '../../App';
import { CartContext } from '../../App';
import { Store, Star, MapPin, Phone, RefreshCw, Package } from 'lucide-react';
import { Button } from '../components/ui/button';

interface StoreProfilePageProps {
  sellerId: number | string;
  isLoggedIn: boolean;
  userRole: UserRole;
  userName?: string;
  onLogin: (role: UserRole, username?: string) => void;
  onLogout: () => void;
  onNavigate: (page: CurrentPage) => void;
  onBack: () => void;
}

interface Seller {
  id: number | string;
  name: string;
  email: string;
  role: string;
  storeName?: string;
  phone?: string;
  address?: string;
  storePhoto?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  category: string;
  categoryId: string;
  seller: string;
  sellerId: number | string;
  image?: string;
  stock: number;
  description?: string;
  discount?: number;
  emoji?: string;
}

export default function StoreProfilePage({
  sellerId,
  isLoggedIn,
  userRole,
  userName,
  onLogin,
  onLogout,
  onNavigate,
  onBack,
}: StoreProfilePageProps) {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    loadStoreData();
  }, [sellerId]);

  const loadStoreData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch seller details
      const sellerResponse = await fetch(`http://localhost:5000/api/auth/sellers/${sellerId}`).catch(() => null);
      if (!sellerResponse || !sellerResponse.ok) {
        throw new Error('Backend server is not available or seller not found');
      }
      const sellerData = await sellerResponse.json();
      setSeller(sellerData);

      // Fetch seller's products
      const productsResponse = await fetch(`http://localhost:5000/api/products/seller/${sellerId}`).catch(() => null);
      if (!productsResponse || !productsResponse.ok) {
        throw new Error('Failed to load products - backend not available');
      }
      const productsData = await productsResponse.json();
      setProducts(productsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load store data. Please ensure the backend server is running.');
      console.error('Store profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      sellerId: product.sellerId,
    }, quantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          userName={userName}
          showCart={true}
          onLogin={onLogin}
          onLogout={onLogout}
          onNavigate={onNavigate}
        />
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center justify-center">
          <RefreshCw className="w-12 h-12 text-slate-700 animate-spin mb-4" />
          <p className="text-gray-500">Chargement de la boutique...</p>
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          userName={userName}
          showCart={true}
          onLogin={onLogin}
          onLogout={onLogout}
          onNavigate={onNavigate}
        />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
            {error || 'Boutique non trouvée'}
          </div>
          <div className="mt-6">
            <Button onClick={onBack} variant="outline">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        userName={userName}
        showCart={true}
        onLogin={onLogin}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />

      {/* Store Header Section */}
      <section className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-slate-700 mb-6"
          >
            ← Retour
          </Button>

          <div className="flex items-start gap-8">
            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <Store className="w-12 h-12 text-slate-700" />
            </div>

            <div className="flex-1">
              <h1 className="text-white mb-3">
                {seller.storeName || seller.name}
              </h1>

              <div className="flex items-center gap-1 mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-xl font-semibold">4.8</span>
                <span className="text-gray-300 ml-2">(120 avis)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300">
                {seller.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{seller.address}</span>
                  </div>
                )}
                {seller.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{seller.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>{products.length} produit{products.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Produits de la boutique</h2>
          <Button onClick={loadStoreData} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Cette boutique n'a pas encore de produits
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                rating={product.rating}
                category={product.category}
                seller={typeof product.seller === 'object' ? (product.seller?.storeName || product.seller?.name) : product.seller}
                discount={product.discount}
                emoji={product.emoji}
                image={product.image}
                stock={product.stock}
                sellerId={product.sellerId}
                onAddToCart={(quantity) => handleAddToCart(product, quantity)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
