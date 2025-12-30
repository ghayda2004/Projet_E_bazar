import { Store, Star } from 'lucide-react';
import { Button } from './ui/button';

interface SellerCardProps {
  sellerId: number | string;
  name: string;
  rating: number;
  productCount: number;
  imageUrl?: string;
  onViewStore?: (sellerId: number | string) => void;
}

export function SellerCard({ sellerId, name, rating, productCount, imageUrl, onViewStore }: SellerCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-center mb-4">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <Store className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      
      <h3 className="text-gray-900 mb-2">{name}</h3>
      
      <div className="flex items-center gap-1 mb-2">
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span className="text-gray-900">{rating}</span>
      </div>
      
      <p className="text-gray-500 mb-4">{productCount} produits</p>
      
      <Button 
        className="w-full bg-slate-700 hover:bg-slate-800"
        onClick={() => onViewStore?.(sellerId)}
      >
        Voir la boutique
      </Button>
    </div>
  );
}
