import { Header } from '../components/Header';
import { CategoryFilter } from '../components/CategoryFilter';
import { SellerCard } from '../components/SellerCard';
import { ProductCard } from '../components/ProductCard';
import { useState, useEffect, useContext } from 'react';
import type { UserRole, CurrentPage } from '../../App';
import { CartContext } from '../../App';
import { Button } from '../components/ui/button';
import { ShoppingBag, Store, TrendingUp, Users, ArrowRight, Sparkles, Package } from 'lucide-react';

interface Seller {
  id: number | string;
  name: string;
  storeName?: string;
  storePhoto?: string;
  phone?: string;
  address?: string;
}

interface HomePageProps {
  isLoggedIn: boolean;
  userRole: UserRole;
  userName?: string;
  onLogin: (role: UserRole, username?: string) => void;
  onLogout: () => void;
  onNavigate: (page: CurrentPage) => void;
  onOpenRegister?: () => void;
}

export default function HomePage({ isLoggedIn, userRole, userName, onLogin, onLogout, onNavigate, onOpenRegister }: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsCount, setProductsCount] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<any[]>([]);
  const [backendOffline, setBackendOffline] = useState(false);

  const { addToCart, showToast } = useContext(CartContext);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      console.log('📡 Fetching sellers and products...');
      const [sellersRes, productsRes] = await Promise.all([
        fetch('http://localhost:5000/api/auth/sellers').catch((err) => {
          console.error('Sellers fetch failed:', err);
          return null;
        }),
        fetch('http://localhost:5000/api/products').catch((err) => {
          console.error('Products fetch failed:', err);
          return null;
        })
      ]);

      if (sellersRes && sellersRes.ok) {
        const sellersData = await sellersRes.json();
        console.log('✅ Sellers data received:', sellersData);

        // Validate sellers data
        if (Array.isArray(sellersData)) {
          setSellers(sellersData);
          setBackendOffline(false);
        } else {
          console.error('❌ Invalid sellers data format:', sellersData);
          setSellers([]);
          setBackendOffline(true);
        }

        if (productsRes && productsRes.ok) {
          const productsData = await productsRes.json();
          console.log('✅ Products data received:', productsData);

          // Validate products data
          if (Array.isArray(productsData)) {
            setProducts(productsData);
            const counts: Record<string, number> = {};
            productsData.forEach((product: any) => {
              if (product && product.sellerId) {
                counts[product.sellerId] = (counts[product.sellerId] || 0) + 1;
              }
            });
            setProductsCount(counts);
          } else {
            console.error('❌ Invalid products data format:', productsData);
            setProducts([]);
          }
        }
      } else {
        console.warn('⚠️ Backend server is not available. Running in offline mode.');
        setBackendOffline(true);
        setSellers([]);
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Error fetching sellers:', error);
      setBackendOffline(true);
      setSellers([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }; return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        userName={userName}
        showCart={userRole === 'client'}
        onLogin={onLogin}
        onLogout={onLogout}
        onNavigate={onNavigate}
        onRefreshSellers={fetchSellers}
        onOpenRegisterAsVendor={onOpenRegister}
      />

      {/* Backend Offline Warning */}
      {backendOffline && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-red-700">
                <strong className="font-semibold">Serveur hors ligne</strong>
                {' '}- Le serveur backend n'est pas disponible. Veuillez démarrer le serveur backend pour voir les produits et vendeurs.
              </p>
            </div>
            <Button
              size="sm"
              onClick={fetchSellers}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Réessayer
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-orange-400" />
              <span className="text-orange-400 font-semibold">Bienvenue sur Elbazare</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Achetez tout ce dont vous avez besoin
            </h1>
            <p className="text-gray-300 text-xl mb-8 leading-relaxed">
              Découvrez des milliers de produits de vendeurs de confiance.
              {!isLoggedIn && " Connectez-vous pour commencer vos achats ou inscrivez-vous comme vendeur pour vendre vos produits."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => onNavigate('products')}
                className="bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                Parcourir les produits
                <ArrowRight className="w-4 h-4" />
              </Button>
              {!isLoggedIn && userRole !== 'vendeur' && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    if (onOpenRegister) {
                      onOpenRegister();
                    }
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 gap-2"
                  title="Inscrivez-vous en tant que vendeur"
                >
                  <Store className="w-5 h-5" />
                  Commencer à vendre
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {!isLoggedIn && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{Math.max(1, sellers.length)}+</h3>
              <p className="text-gray-600">Vendeurs actifs</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">1000+</h3>
              <p className="text-gray-600">Produits disponibles</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">98%</h3>
              <p className="text-gray-600">Satisfaction client</p>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      {/* Top Sellers */}
      <section className="max-w-7xl mx-auto px-6 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-2">Meilleurs vendeurs</h2>
            <p className="text-gray-600">Découvrez nos vendeurs de confiance</p>
          </div>
          <Button
            variant="outline"
            onClick={() => onNavigate('products')}
            className="gap-2"
          >
            Voir tous les produits
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Chargement des vendeurs...</p>
          </div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Aucun vendeur disponible pour le moment</p>
            <p className="text-sm text-gray-400">Revenez bientôt pour découvrir nos vendeurs!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sellers.filter(seller => seller && seller.id).map((seller) => (
              <SellerCard
                key={seller.id}
                sellerId={seller.id}
                name={seller.storeName || seller.name || 'Vendeur Inconnu'}
                rating={4.5}
                productCount={productsCount[seller.id] || 0}
                imageUrl={seller.storePhoto || undefined}
                onViewStore={(sellerId) => onNavigate('store-profile', sellerId)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-6 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-2 flex items-center gap-2">
              <Package className="w-6 h-6 text-orange-500" />
              Produits populaires
            </h2>
            <p className="text-gray-600">Découvrez nos meilleurs produits</p>
          </div>
          <Button
            variant="outline"
            onClick={() => onNavigate('products')}
            className="gap-2"
          >
            Tous les produits
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Chargement des produits...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Aucun produit disponible pour le moment</p>
            <p className="text-sm text-gray-400">Revenez bientôt pour découvrir nos produits!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                rating={product.rating}
                category={product.category}
                seller={typeof product.seller === 'object' ? (product.seller?.storeName || product.seller?.name) : product.seller}
                emoji={product.emoji}
                image={product.image}
                discount={product.discount}
                stock={product.stock}
                sellerId={product.sellerId}
                onAddToCart={(quantity) => {
                  if (isLoggedIn && userRole === 'client') {
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      sellerId: product.sellerId,
                    }, quantity);
                    showToast(`${product.name} ajouté au panier (x${quantity})`, 'success');
                  } else if (!isLoggedIn) {
                    showToast('Veuillez vous connecter pour ajouter au panier', 'warning');
                  }
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}