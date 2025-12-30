# 🛒 El Bazar - Plateforme E-commerce

El Bazar est une plateforme e-commerce moderne développée avec React, Node.js, et Prisma, conçue pour connecter les clients et les vendeurs locaux au sein d'un même espace digital. L'objectif du site est de mettre en avant les petits commerces et leurs produits, tout en offrant une expérience fluide, rapide et intuitive aux utilisateurs.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Démarrage du projet](#démarrage-du-projet)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Résolution des problèmes](#résolution-des-problèmes)

## ✨ Fonctionnalités

### Client
- ✅ **Authentification JWT** (Inscription/Connexion/Déconnexion)
- ✅ **Navigation des produits** avec filtres et recherche
- ✅ **Panier d'achats** avec gestion des quantités
- ✅ **Gestion des commandes** et historique
- ✅ **Profils des vendeurs** avec leurs produits
- ✅ **Formulaire de contact**

### Vendeur
- ✅ **Dashboard** avec statistiques en temps réel
- ✅ **Gestion des produits** (Créer, Lire, Modifier, Supprimer)
- ✅ **Gestion des commandes** reçues
- ✅ **Profil de boutique** personnalisable

## 🛠 Technologies

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build rapide
- **Tailwind CSS** pour le styling
- **Shadcn/ui** pour les composants UI
- **Lucide React** pour les icônes

### Backend
- **Node.js** avec Express
- **Prisma ORM** pour la base de données
- **SQLite** (développement) / PostgreSQL (production)
- **JWT** pour l'authentification
- **bcryptjs** pour le hachage des mots de passe

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé:

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
```

### 4. (Optionnel) Peupler la base de données avec des données de test

```bash
node prisma/seed.js
```

### 5. Installer les dépendances du Frontend

```bash
cd ../frontend
npm install
```

## 🚀 Démarrage du projet

### Option 1: Démarrage Manuel (Recommandé pour le développement)

**Terminal 1 - Backend:**
```bash
cd backend
node src/server.js
```

Vous devriez voir:
```
✅ Database connected successfully
🚀 Server is running on http://localhost:5000
📡 API endpoints:
   - Authentication: http://localhost:5000/api/auth
   - Products: http://localhost:5000/api/products
   - Orders: http://localhost:5000/api/orders
   - Contact: http://localhost:5000/api/contact
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Vous devriez voir:
```
  VITE v6.3.5  ready in XXX ms
  ➜  Local:   http://localhost:3000/
```

### Option 2: Script Automatisé (macOS/Linux)

Créez un fichier `start.sh` à la racine du projet:

```bash
#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Démarrage de El Bazar...${NC}"

# Démarrer le backend
echo -e "${GREEN}📦 Démarrage du backend...${NC}"
cd backend && node src/server.js &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 3

# Démarrer le frontend
echo -e "${GREEN}🎨 Démarrage du frontend...${NC}"
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo -e "${BLUE}✅ Application démarrée!${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}Backend: http://localhost:5000${NC}"

# Arrêt propre avec Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
```

Rendre le script exécutable et le lancer:
```bash
chmod +x start.sh
./start.sh
```

### 🌐 Accéder à l'application

Une fois les deux serveurs démarrés, ouvrez votre navigateur:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/health

## 📁 Structure du projet

```

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
│   │   │   ├── authService.ts
│   │   │   ├── productService.ts
│   │   │   └── orderService.ts
│   │   └── styles/        # Fichiers CSS
│   ├── App.tsx            # Composant principal
│   ├── main.tsx           # Point d'entrée
│   └── package.json
│
├── backend/               # API Node.js + Express
│   ├── src/
│   │   ├── controllers/   # Logique métier
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── orderController.js
│   │   │   └── contactController.js
│   │   ├── routes/        # Routes API
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── contactRoutes.js
│   │   ├── models/        # Configuration DB
│   │   │   └── db.js      # Prisma client
│   │   ├── middleware/    # Middleware
│   │   │   └── auth.js    # JWT authentication
│   │   └── server.js      # Point d'entrée serveur
│   ├── prisma/
│   │   ├── schema.prisma  # Schéma de base de données
│   │   ├── seed.js        # Données de test
│   │   ├── dev.db         # Base de données SQLite
│   │   └── migrations/    # Migrations Prisma
│   ├── .env               # Variables d'environnement
│   └── package.json
│
└── README.md              # Ce fichier
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register     # Inscription
POST   /api/auth/login        # Connexion
GET    /api/auth/profile      # Profil utilisateur (Auth requis)
PUT    /api/auth/profile      # Mise à jour profil (Auth requis)
GET    /api/auth/sellers      # Liste des vendeurs
GET    /api/auth/sellers/:id  # Détails d'un vendeur
```

### Products
```
GET    /api/products              # Tous les produits
GET    /api/products/:id          # Détails d'un produit
GET    /api/products/seller       # Produits du vendeur (Auth requis)
GET    /api/products/seller/:id   # Produits d'un vendeur spécifique
POST   /api/products              # Créer un produit (Vendeur uniquement)
PUT    /api/products/:id          # Modifier un produit (Vendeur uniquement)
DELETE /api/products/:id          # Supprimer un produit (Vendeur uniquement)
```

### Orders
```
GET    /api/orders           # Commandes de l'utilisateur (Auth requis)
GET    /api/orders/seller    # Commandes reçues par le vendeur (Auth requis)
POST   /api/orders           # Créer une commande (Client uniquement)
PUT    /api/orders/:id       # Mettre à jour le statut (Vendeur uniquement)
```

### Contact
```
POST   /api/contact          # Envoyer un message
```

## 🐛 Résolution des problèmes

### Le port 5000 est déjà utilisé

```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Le port 3000 est déjà utilisé

Vite utilisera automatiquement le port 3001. Ou tuez le processus:

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erreur "Objects are not valid as a React child"

✅ Ce problème a été résolu. Si vous voyez toujours cette erreur:
1. Assurez-vous d'avoir la dernière version du code
2. Rafraîchissez votre navigateur (Cmd+Shift+R ou Ctrl+Shift+R)
3. Vérifiez que le backend est bien démarré

### Erreur de base de données

Régénérez la base de données:

```bash
cd backend
rm prisma/dev.db  # Supprimer l'ancienne DB
npx prisma generate
npx prisma db push
node prisma/seed.js  # Optionnel: données de test
```

### Page blanche ou erreur au démarrage

1. Vérifiez que les deux serveurs sont démarrés
2. Ouvrez la console du navigateur (F12) pour voir les erreurs
3. Vérifiez les logs du terminal backend
4. Le composant ErrorBoundary devrait afficher un message d'erreur détaillé

### Problèmes de dépendances

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

## 👥 Comptes de test

Après avoir exécuté `node prisma/seed.js`, vous aurez:

**Client:**
```
Email: client@example.com
Password: password123
```

**Vendeur:**
```
Email: seller@example.com
Password: password123
```

## 📚 Documentation supplémentaire

- [Frontend Features](./frontend/FEATURES.md)
- [Backend Prisma Setup](./backend/PRISMA_SETUP.md)
- [User Guide](./USER_GUIDE.md)
- [Database Fix Summary](./DATABASE_FIX_SUMMARY.md)

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à:

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT

## 👨‍💻 Auteurs

- **Repository Owner:** [ghayda2004](https://github.com/ghayda2004)
- **Contributors:** Voir [contributors](https://github.com/ghayda2004/Projet_E_bazar/contributors)

## 🙏 Remerciements

- Design inspiré de [E-commerce Website in French - Figma](https://www.figma.com/design/3CZcm12kmDnywxWpb1fBV5/E-commerce-Website-in-French)
- Composants UI de [Shadcn/ui](https://ui.shadcn.com/)
- Icônes de [Lucide](https://lucide.dev/)

---

**🎉 Bon développement avec El Bazar!**
git clone https://github.com/ghayda2004/Projet_web_elbazar.git
cd Projet_web_elbazar
```

### 2. Backend Setup

```bash
cd backend
npm install

# Créer le fichier .env (ou copier depuis .env.example)
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
