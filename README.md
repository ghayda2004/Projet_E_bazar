# 🛒 Elbazar - E-commerce Platform

A modern e-commerce platform built with React, Node.js, Express, and Prisma. Connect local buyers and sellers in one digital marketplace.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **Git**

Vérifiez vos versions:
```bash
node --version  # devrait afficher v18.x.x ou supérieur
npm --version   # devrait afficher 9.x.x ou supérieur
```

## 📥 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/ghayda2004/Projet_E_bazar.git
cd Projet_E_bazar
```

### 2. Installer les dépendances du Backend

```bash
cd backend
npm install
```

### 3. Configurer la base de données

Le fichier `.env` existe déjà, mais vérifiez qu'il contient:

```env
DATABASE_URL="file:./dev.db"
PORT=5000
JWT_SECRET="your_jwt_secret_key_change_this_in_production"
NODE_ENV=development
```

Générer le client Prisma et créer la base de données:

```bash
npx prisma generate
npx prisma db push

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Setup

**1. Clone the repository**
```bash
git clone https://github.com/ghayda2004/Projet_E_bazar.git
cd Projet_E_bazar
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
DATABASE_URL="file:./dev.db"
PORT=5000
JWT_SECRET="your_jwt_secret_key_change_this_in_production"
NODE_ENV=development
```

Initialize database:
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js
```

**3. Setup Frontend**
```bash
cd ../frontend
npm install
```

### Running the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
node src/server.js
```

You should see:
```
✅ Database connected successfully
🚀 Server is running on http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

**Access the application:** Open http://localhost:3000 in your browser

## 👥 Test Accounts

After seeding the database:

**Buyer Account:**
- Email: `buyer@example.com`
- Password: `password123`

**Seller Account:**
- Email: `seller@example.com`
- Password: `password123`

## 🏗️ Project Structure



Projet_E_bazar/
├── frontend/              # Application React + Vite
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   │   ├── ui/        # Composants Shadcn/ui
│   │   │   ├── Header.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── SellerCard.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── pages/         # Pages principales
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── SellerDashboard.tsx
│   │   │   ├── StoreProfilePage.tsx
│   │   │   └── MyOrdersPage.tsx
│   │   ├── services/      # Services API
│   │   │   ├── api.ts
Projet_E_bazar/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Test data
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Authentication
│   │   ├── models/            # Database config
│   │   └── server.js          # Entry point
│   ├── .env                   # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable components
    │   ├── pages/             # Main pages
    │   ├── services/          # API services
    │   └── utils/             # Helper functions
    ├── App.tsx                # Main component
    └── package.json
```

## 🔧 Features

### For Buyers
- ✅ Browse products with filters
- ✅ Shopping cart management
- ✅ Order placement and tracking
- ✅ Seller profiles
- ✅ Chatbot assistance

### For Sellers
- ✅ Dashboard with statistics
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Store profile customization

## � API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/sellers` - List all sellers

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Seller only)
- `PUT /api/products/:id` - Update product (Seller only)
- `DELETE /api/products/:id` - Delete product (Seller only)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/seller` - Get seller orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status

### Contact
- `POST /api/contact` - Send message

## �️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui Components
- Lucide Icons

**Backend:**
- Node.js + Express
- Prisma ORM
- SQLite (development)
- JWT Authentication
- bcryptjs

## 🐛 Troubleshooting

### Port 5000 already in use
```bash
lsof -ti:5000 | xargs kill -9
```

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Database issues
```bash
cd backend
rm prisma/dev.db
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### Dependencies issues
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT

## 👨‍💻 Authors

- **Repository Owner:** [ghayda2004](https://github.com/ghayda2004)

## 🙏 Acknowledgments

- Design inspired by [E-commerce Website in French - Figma](https://www.figma.com/design/3CZcm12kmDnywxWpb1fBV5/E-commerce-Website-in-French)
- UI Components: [Shadcn/ui](https://ui.shadcn.com/)
- Icons: [Lucide](https://lucide.dev/)

---

**Made with ❤️ by the Elbazar Team**

cp .env.example .env

# Démarrer le serveur backend
npm start
```

Le serveur backend démarrera sur `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Créer le fichier .env avec l'URL du backend
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Démarrer le serveur de développement
npm run dev
```

Le frontend démarrera sur `http://localhost:3000`

### 4. Accéder à l'application

Ouvrez votre navigateur à `http://localhost:3000`

## Comptes de test

**Client:**
- Email: `buyer@example.com`
- Mot de passe: `password123`

**Vendeur:**
- Email: `seller@example.com`
- Mot de passe: `password123`

## Technologies utilisées

### Frontend
- React 18 avec Hooks (useState, useEffect, useContext, useMemo, useCallback)
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Radix UI (composants)
- Lucide React (icônes)

### Backend
- Node.js
- Express.js
- JWT pour l'authentification
- bcryptjs pour le hachage des mots de passe
- CORS pour les requêtes cross-origin

### Base de données
- Actuellement: Stockage en mémoire (développement)
- Production: Facilement remplaçable par MongoDB, PostgreSQL, etc.

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Mise à jour du profil

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit (vendeur)
- `PUT /api/products/:id` - Modifier un produit (vendeur)
- `DELETE /api/products/:id` - Supprimer un produit (vendeur)
- `GET /api/products/seller` - Produits du vendeur

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/user` - Commandes de l'utilisateur
- `GET /api/orders/seller` - Commandes du vendeur
- `PUT /api/orders/:id/status` - Modifier le statut

### Contact
- `POST /api/contact` - Envoyer un message
- `GET /api/contact` - Liste des messages (vendeur)

## Développement

### Frontend
```bash
cd frontend
npm run dev      # Mode développement
npm run build    # Build production
```

### Backend
```bash
cd backend
npm run dev      # Mode développement (avec watch)
npm start        # Mode production
```

## Tests

### Tester l'authentification
1. Cliquez sur "Se connecter"
2. Utilisez les comptes de test
3. Vérifiez que vous êtes redirigé selon votre rôle

### Tester la gestion des produits (Vendeur)
1. Connectez-vous en tant que vendeur
2. Accédez au dashboard vendeur
3. Ajoutez/modifiez/supprimez des produits

### Tester le panier (Client)
1. Connectez-vous en tant que client
2. Ajoutez des produits au panier
3. Vérifiez le panier via l'icône en haut à droite

## Contribuer

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est open-source et accessible à tous les développeurs intéressés.

## Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

**Note**: Ce projet utilise actuellement une base de données en mémoire pour le développement. Pour la production, remplacez `backend/src/models/database.js` par une vraie base de données (MongoDB, PostgreSQL, etc.).
