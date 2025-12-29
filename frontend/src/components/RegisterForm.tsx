// components/RegisterForm.tsx
import { useState } from 'react';
import { UserRole } from '../App.tsx';
import { register as registerAPI } from '../services/authService';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface RegisterFormProps {
  onRegister: (userData: any) => void;
  onNavigate: (page: 'login' | 'home') => void;
  onOpenLogin?: () => void;
  defaultRole?: 'client' | 'vendeur';
}

export default function RegisterForm({ onRegister, onNavigate, onOpenLogin, defaultRole = 'client' }: RegisterFormProps) {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    storeName: '',
    address: '',
    storePhoto: '',
  });
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, storePhoto: reader.result as string }));
        setPhotoUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.includes('@')) newErrors.email = 'Email invalide';
    if (formData.password.length < 6) newErrors.password = 'Minimum 6 caractères';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    if (role === 'seller' && !formData.storeName.trim()) {
      newErrors.storeName = 'Le nom de la boutique est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await registerAPI({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role === 'buyer' ? 'client' : 'vendeur',
        phone: formData.phone,
        storeName: role === 'seller' ? formData.storeName : undefined,
        address: role === 'seller' ? formData.address : undefined,
        storePhoto: role === 'seller' ? formData.storePhoto : undefined,
      });

      // Call parent register handler - redirect will be handled by parent
      onRegister(response.user);
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message || 'Erreur lors de l\'inscription' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Je m'inscris en tant que :</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition ${
              role === 'buyer'
                ? 'bg-slate-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Acheteur
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition ${
              role === 'seller'
                ? 'bg-slate-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vendeur
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm">
              Nom complet
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm">
            Téléphone
          </Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+216 12 345 678"
          />
        </div>

        {role === 'seller' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="storeName" className="text-sm">
                  Nom de la boutique
                </Label>
                <Input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className={errors.storeName ? 'border-red-500' : ''}
                />
                {errors.storeName && <p className="text-red-500 text-xs mt-0.5">{errors.storeName}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-sm">
                  Adresse de la boutique
                </Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Rue, Ville, Gouvernorat"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="storePhoto" className="text-sm">
                Logo de la boutique (PNG/JPG)
              </Label>
              <Input
                type="file"
                id="storePhoto"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {photoUploaded && (
                <p className="text-green-600 text-xs mt-0.5">✓ Photo téléchargée avec succès</p>
              )}
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm">
              Mot de passe
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm">
              Confirmer le mot de passe
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'border-red-500' : ''}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-0.5">{errors.confirmPassword}</p>}
          </div>
        </div>

        {errors.submit && (
          <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white text-sm font-medium transition ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-slate-700 hover:bg-slate-800'
          }`}
        >
          {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-500">
        Déjà un compte ?{' '}
        <button
          type="button"
          onClick={() => {
            if (onOpenLogin) {
              onOpenLogin();
            } else {
              onNavigate('login');
            }
          }}
          className="text-slate-700 font-medium hover:underline"
        >
          Se connecter
        </button>
      </p>
    </div>
  );
}
