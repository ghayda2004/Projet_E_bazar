# Projet Web El Bazar

Elbazar est un site  e-commerce moderne développée avec React et Vite, conçue pour connecter les clients et les vendeurs locaux au sein d’un même espace digital.
L’objectif du site est de mettre en avant les petits commerces et leurs produits, tout en offrant une expérience fluide, rapide et intuitive aux utilisateurs.
## Présentation

Ce projet fournit une plateforme e-commerce complète avec authentification, gestion de produits, panier d'achats, et interface vendeur. L'interface est inspirée d'une maquette Figma : [E-commerce Website in French](https://www.figma.com/design/3CZcm12kmDnywxWpb1fBV5/E-commerce-Website-in-French).

## Fonctionnalités principales

### ✅ Fonctionnalités Implémentées

- ✅ **Authentification complète** (JWT-based)
  - Inscription utilisateur (client/vendeur)
  - Connexion/déconnexion
  - Gestion de profil
  
- ✅ **Gestion des produits**
  - Affichage des produits avec filtres et tri
  - Ajout/Modification/Suppression (vendeurs uniquement)
  - Catégories et recherche
  - Support de 3 sources de données : Mock local, Fake Store API, Backend DB

- ✅ **Panier d'achats**
  - Ajout/suppression d'articles
  - Calcul automatique du total
  - Badge de notification

- ✅ **Interface Vendeur**
  - Dashboard avec statistiques
  - Gestion complète des produits (CRUD)
  - Visualisation des commandes

- ✅ **Gestion des commandes**
  - Création de commandes
  - Suivi des commandes utilisateur
  - Gestion des commandes vendeur

- ✅ **Formulaire de contact**
  - Soumission avec validation
  - Stockage des messages

## Structure du projet

```
Projet_web_elbazar/
├── frontend/          # Application React + Vite
│   ├── src/
│   │   ├── components/    # Composants UI
│   │   ├── pages/         # Pages principales
│   │   ├── services/      # Services API
│   │   └── data/          # Données mock
│   └── package.json
│
├── backend/           # API Node.js + Express
│   ├── src/
│   │   ├── controllers/   # Logique métier
│   │   ├── routes/        # Routes API
│   │   ├── models/        # Modèles de données
│   │   └── middleware/    # Authentification
│   └── package.json
│
└── README.md
```

## Installation et démarrage

### Prérequis
- Node.js v18+ 
- npm ou yarn

### 1. Cloner le dépôt
```bash
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
