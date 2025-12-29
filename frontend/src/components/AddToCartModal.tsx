import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string | number;
    name: string;
    price: number;
    image?: string;
    emoji?: string;
    stock?: number;
    sellerId?: string | number;
  } | null;
  onConfirm: (quantity: number) => void;
}

export function AddToCartModal({ isOpen, onClose, product, onConfirm }: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleIncrement = () => {
    if (product.stock && quantity >= product.stock) return;
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleConfirm = () => {
    onConfirm(quantity);
    setQuantity(1);
    onClose();
  };

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  const totalPrice = product.price * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-orange-500" />
            Ajouter au panier
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Product Info */}
          <div className="flex gap-4">
            <div className="w-20 h-20 min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-20 h-20 object-cover"
                  style={{ maxWidth: '80px', maxHeight: '80px', width: '80px', height: '80px' }}
                />
              ) : product.emoji ? (
                <span className="text-4xl">{product.emoji}</span>
              ) : (
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-lg font-bold text-orange-600">${product.price.toFixed(2)}</p>
              {product.stock !== undefined && (
                <p className="text-sm text-gray-500 mt-1">
                  {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                </p>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Quantité</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="h-10 w-10 p-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <div className="flex-1 text-center">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    if (product.stock && val > product.stock) {
                      setQuantity(product.stock);
                    } else if (val >= 1) {
                      setQuantity(val);
                    }
                  }}
                  min="1"
                  max={product.stock}
                  className="w-full text-center text-xl font-semibold border rounded-lg py-2"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleIncrement}
                disabled={product.stock !== undefined && quantity >= product.stock}
                className="h-10 w-10 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={product.stock === 0}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
