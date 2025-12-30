import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { BarChart3, Package, Star, Plus, Pencil, Trash2, RefreshCw, ShoppingCart } from 'lucide-react';
import { ProductForm } from '../components/ProductForm';
import type { CurrentPage } from '../../App';
import { useState, useEffect } from 'react';
import { getSellerProducts, deleteProduct } from '../services/productService';
import formatTND from '../utils/formatPrice';
import { getSellerOrders, updateOrderStatus, type Order, type OrderItem } from '../services/orderService';

interface SellerDashboardProps {
  userName?: string;
  onLogout: () => void;
  onNavigate: (page: CurrentPage) => void;
}

export default function SellerDashboard({ userName, onLogout, onNavigate }: SellerDashboardProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [orderFilter, setOrderFilter] = useState<'all' | Order['status']>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [productsData, ordersData] = await Promise.all([
        getSellerProducts(),
        getSellerOrders()
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      await deleteProduct(productId);
      await loadData(); // Reload data
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleFormSuccess = () => {
    loadData();
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadData(); // Reload data
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusBadgeColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: Order['status'] | 'all') => {
    const labels = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé',
      all: 'Toutes',
    };
    return labels[status] || status;
  };

  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(order => order.status === orderFilter);

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const activeProducts = products.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isLoggedIn={true}
        userRole="vendeur"
        userName={userName || 'Ma Boutique'}
        onLogin={() => { }}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 bg-slate-700 transform rotate-45" />
              <h1 className="text-gray-900">Elbazare Seller</h1>
            </div>
          </div>
          <Button onClick={loadData} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Revenu total"
            value={formatTND(totalRevenue)}
            icon={BarChart3}
            iconColor="bg-purple-100 text-purple-600"
          />
          <StatCard
            title="Total des commandes"
            value={totalOrders}
            icon={Package}
            iconColor="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Produits actifs"
            value={activeProducts}
            icon={Package}
            iconColor="bg-green-100 text-green-600"
          />
          <StatCard
            title="Note de la boutique"
            value={`4.8⭐`}
            icon={Star}
            iconColor="bg-yellow-100 text-yellow-600"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-gray-900">Mes produits</h2>
            <Button onClick={handleAddProduct} className="gap-2 bg-slate-700 hover:bg-slate-800">
              <Plus className="w-4 h-4" />
              Ajouter un produit
            </Button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
              Chargement...
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucun produit. Cliquez sur "Ajouter un produit" pour commencer.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xl">{product.emoji || '📦'}</span>
                        </div>
                        <span>{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell>{formatTND(product.price)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 hover:bg-green-100"
                      >
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Orders Management Table */}
        <div className="bg-white rounded-lg border border-gray-200 mt-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Gestion des commandes
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value as 'all' | Order['status'])}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">Toutes les commandes</option>
                  <option value="pending">En attente</option>
                  <option value="processing">En traitement</option>
                  <option value="shipped">Expédié</option>
                  <option value="delivered">Livré</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
              Chargement...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {orderFilter === 'all'
                ? 'Aucune commande pour le moment.'
                : `Aucune commande avec le statut "${getStatusLabel(orderFilter)}".`
              }
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Commande</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      #{order.id}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                        <div className="text-xs text-gray-500 mt-1">
                          {order.items.slice(0, 2).map((item: OrderItem, idx: number) => (
                            <div key={idx}>{item.name} (x{item.quantity})</div>
                          ))}
                          {order.items.length > 2 && (
                            <div>+{order.items.length - 2} autre{order.items.length - 2 > 1 ? 's' : ''}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatTND(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusBadgeColor(order.status)}
                      >
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="pending">En attente</option>
                        <option value="processing">En traitement</option>
                        <option value="shipped">Expédié</option>
                        <option value="delivered">Livré</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <ProductForm
        open={showProductForm}
        onClose={() => setShowProductForm(false)}
        onSuccess={handleFormSuccess}
        product={editingProduct}
      />
    </div>
  );
}