import { ShoppingBag, Sofa, Smartphone, Shirt, BookOpen, Trophy, Flower, Gamepad2 } from 'lucide-react';
import { Button } from './ui/button';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { id: 'all', name: 'Tout', icon: <ShoppingBag className="w-5 h-5" /> },
  { id: 'furniture', name: 'Meubles', icon: <Sofa className="w-5 h-5" /> },
  { id: 'electronics', name: 'Électronique', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'fashion', name: 'Mode', icon: <Shirt className="w-5 h-5" /> },
  { id: 'books', name: 'Livres', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'sports', name: 'Sports', icon: <Trophy className="w-5 h-5" /> },
  { id: 'garden', name: 'Maison & Jardin', icon: <Flower className="w-5 h-5" /> },
  { id: 'games', name: 'Jeux & Jouets', icon: <Gamepad2 className="w-5 h-5" /> },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="py-8">
      <h3 className="text-gray-500 mb-4 uppercase tracking-wide">Catégories</h3>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className={`gap-2 ${
              selectedCategory === category.id 
                ? 'bg-slate-700 hover:bg-slate-800' 
                : 'bg-white hover:bg-gray-50'
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
