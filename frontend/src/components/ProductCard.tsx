import { Star, ShoppingCart, Check, Heart, Eye, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { AddToCartModal } from './AddToCartModal';
import formatTND from '../utils/formatPrice';

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  rating: number;
  category?: string;
  seller?: string;
  discount?: number;
  emoji?: string;
  image?: string;
  stock?: number;
  sellerId?: string | number;
  onAddToCart?: (quantity: number) => void;
}

export function ProductCard({
  id,
  name,
  price,
  rating,
  category,
  seller,
  discount,
  emoji,
  image,
  stock,
  sellerId,
  onAddToCart
}: ProductCardProps) {
  // useState hook - tracks button states for visual feedback
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isViewed, setIsViewed] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  const finalPrice = discount ? price * (1 - discount / 100) : price;

  // Button functionality - add to cart with visual feedback
  const handleAddToCart = () => {
    setShowQuantityModal(true);
  };

  const handleConfirmAddToCart = (quantity: number) => {
    if (onAddToCart) {
      onAddToCart(quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
    }
  };

  // Button functionality - toggle favorite with animation
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Button functionality - quick view with feedback
  const handleQuickView = () => {
    setIsViewed(true);
    setTimeout(() => setIsViewed(false), 1500);
    alert(`Aperçu rapide: ${name}\nPrix: ${formatTND(finalPrice)}\nCatégorie: ${category}\nVendeur: ${seller}`);
  };

  // Button functionality - share with feedback
  const handleShare = () => {
    setIsShared(true);
    setTimeout(() => setIsShared(false), 1500);
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Découvrez ${name} pour seulement ${formatTND(finalPrice)}!`,
        url: window.location.href,
      }).catch(() => { });
    } else {
      alert('Lien copié dans le presse-papiers!');
    }
  };

  return (
    <>
      <AddToCartModal
        isOpen={showQuantityModal}
        onClose={() => setShowQuantityModal(false)}
        product={{
          id,
          name,
          price,
          image,
          emoji,
          stock,
          sellerId,
        }}
        onConfirm={handleConfirmAddToCart}
      />

      <div
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative bg-gray-50 h-64 flex items-center justify-center overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl">{emoji || '📦'}</span>
          )}
          {discount && (
            <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 animate-pulse">
              -{discount}%
            </Badge>
          )}

          {/* Quick Action Buttons - Show on Hover */}
          <div className={`absolute top-3 left-3 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full transition-all duration-300 ${isFavorite
                  ? 'bg-red-500 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 shadow-md'
                }`}
              title="Ajouter aux favoris"
            >
              <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-current animate-bounce' : ''
                }`} />
            </button>

            <button
              onClick={handleQuickView}
              className={`p-2 rounded-full transition-all duration-300 ${isViewed
                  ? 'bg-blue-500 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-500 shadow-md'
                }`}
              title="Aperçu rapide"
            >
              <Eye className={`w-4 h-4 ${isViewed ? 'animate-pulse' : ''
                }`} />
            </button>

            <button
              onClick={handleShare}
              className={`p-2 rounded-full transition-all duration-300 ${isShared
                  ? 'bg-green-500 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-500 shadow-md'
                }`}
              title="Partager"
            >
              <Share2 className={`w-4 h-4 ${isShared ? 'animate-spin' : ''
                }`} />
            </button>
          </div>

          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300" />
          )}
        </div>

        <div className="p-4">
          <p className="text-gray-500 text-xs uppercase tracking-wide">{category}</p>
          <p className="text-gray-400 text-xs">{seller}</p>
          <h3 className="text-gray-900 mt-1 mb-2 line-clamp-2 h-12 font-medium">{name}</h3>

          {stock !== undefined && (
            <p className="text-xs mb-2">
              {stock > 0 ? (
                <span className="text-green-600">✓ {stock} en stock</span>
              ) : (
                <span className="text-red-600">✗ Rupture de stock</span>
              )}
            </p>
          )}

          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-gray-900 font-bold text-lg">{formatTND(finalPrice)}</span>
              {discount && (
                <span className="text-gray-400 line-through text-sm">{formatTND(price)}</span>
              )}
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-gray-900 font-semibold">{rating.toFixed(1)}</span>
            </div>
          </div>

          <Button
            className={`w-full gap-2 transition-all duration-300 transform ${isAdded
                ? 'bg-green-600 hover:bg-green-700 scale-105'
                : 'bg-slate-700 hover:bg-slate-800 hover:scale-105'
              }`}
            onClick={handleAddToCart}
            disabled={isAdded}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                Ajouté!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Ajouter au panier
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
