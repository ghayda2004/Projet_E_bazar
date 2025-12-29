import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { useState, useEffect, useContext } from 'react';
import type { UserRole, CurrentPage } from '../../App';
import { CartContext } from '../../App';
import { getProducts } from '../services/productService';
import { Button } from '../components/ui/button';
import { RefreshCw, Grid3x3, List, SlidersHorizontal, TrendingUp, Sparkles } from 'lucide-react';

interface ProductsPageProps {
  isLoggedIn: boolean;
  userRole: UserRole;
  userName?: string;
  onLogin: (role: UserRole, username?: string) => void;
  onLogout: () => void;
  onNavigate: (page: CurrentPage) => void;
}

export default function ProductsPage({ isLoggedIn, userRole, userName, onLogin, onLogout, onNavigate }: ProductsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  // useState hook - manages component state
  const [backendProducts, setBackendProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // useContext hook - accesses cart context
  const { addToCart } = useContext(CartContext);

  // useEffect hook - handles side effects (API calls)
  useEffect(() => {
    loadBackendProducts();
  }, []);

  const loadBackendProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setBackendProducts(data);
    } catch (err: any) {
      setError(err.message || 'Échec du chargement des produits depuis le backend');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Button functionality - toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };
  
  // Button functionality - toggle filters panel
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Button functionality - sort products
  const handleSort = (type: typeof sortBy) => {
    setSortBy(type);
  };

  const handleAddToCart = (product: any, quantity: number) => {
    addToCart({
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      image: product.image,
      sellerId: product.sellerId,
    }, quantity);
  };

  // Apply category filtering
  const filterByCategory = (productList: any[]) => {
    if (selectedCategory === 'all') return productList;
    return productList.filter(p => p.categoryId === selectedCategory);
  };
  
  // Apply sorting
  const sortProducts = (productList: any[]) => {
    const sorted = [...productList];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.rating?.rate || b.rating) - (a.rating?.rate || a.rating));
      default:
        return sorted;
    }
  };
  
  const getDisplayProducts = () => {
    let products = backendProducts;
    products = filterByCategory(products);
    return sortProducts(products);
  };

  const displayProducts = getDisplayProducts();

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
      
      <section className="max-w-7xl mx-auto px-6">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-orange-500" />
            Tous les produits
            <span className="text-sm text-gray-500 font-normal">
              ({displayProducts.length} articles)
            </span>
          </h1>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={toggleViewMode}
              variant="outline"
              size="sm"
              className={`gap-2 transition-all duration-300 ${
                viewMode === 'grid' ? 'bg-slate-100' : ''
              }`}
              title={viewMode === 'grid' ? 'Vue liste' : 'Vue grille'}
            >
              {viewMode === 'grid' ? (
                <Grid3x3 className="w-4 h-4" />
              ) : (
                <List className="w-4 h-4" />
              )}
            </Button>
            
            <Button 
              onClick={toggleFilters}
              variant="outline"
              size="sm"
              className={`gap-2 transition-all duration-300 ${
                showFilters ? 'bg-blue-100 text-blue-700 border-blue-300' : ''
              }`}
            >
              <SlidersHorizontal className={`w-4 h-4 transition-transform duration-300 ${
                showFilters ? 'rotate-180' : ''
              }`} />
              Filtres
            </Button>
          </div>
        </div>

        <div className={`mb-6 transition-all duration-300 ${
          showFilters ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Trier par:
              </span>
              <Button
                onClick={() => handleSort('default')}
                variant="outline"
                size="sm"
                className={`transition-all duration-300 ${
                  sortBy === 'default' 
                    ? 'bg-slate-700 text-white border-slate-700 scale-105' 
                    : 'hover:scale-105'
                }`}
              >
                Par défaut
              </Button>
              <Button
                onClick={() => handleSort('price-asc')}
                variant="outline"
                size="sm"
                className={`transition-all duration-300 ${
                  sortBy === 'price-asc' 
                    ? 'bg-slate-700 text-white border-slate-700 scale-105' 
                    : 'hover:scale-105'
                }`}
              >
                Prix croissant
              </Button>
              <Button
                onClick={() => handleSort('price-desc')}
                variant="outline"
                size="sm"
                className={`transition-all duration-300 ${
                  sortBy === 'price-desc' 
                    ? 'bg-slate-700 text-white border-slate-700 scale-105' 
                    : 'hover:scale-105'
                }`}
              >
                Prix décroissant
              </Button>
              <Button
                onClick={() => handleSort('rating')}
                variant="outline"
                size="sm"
                className={`transition-all duration-300 ${
                  sortBy === 'rating' 
                    ? 'bg-slate-700 text-white border-slate-700 scale-105' 
                    : 'hover:scale-105'
                }`}
              >
                Meilleures notes
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-pulse">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 text-slate-700 animate-spin" />
              <div className="text-gray-500 animate-pulse">Chargement des produits...</div>
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 transition-all duration-300 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {displayProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.title || product.name}
                price={product.price}
                rating={product.rating?.rate || product.rating}
                category={product.category}
                seller={product.seller || "API Store"}
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