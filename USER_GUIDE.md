# 🛍️ El Bazar - Guide d'utilisation

## 🚀 Démarrage

### Lancer l'application:
1. **Backend**: Ouvrir terminal PowerShell → `cd backend` → `npm run dev`
2. **Frontend**: Ouvrir autre terminal → `cd frontend` → `npm run dev`
3. Ouvrir http://localhost:3000

---

## 👤 Pour les ACHETEURS (Buyers)

### S'inscrire:
1. Cliquer sur "Connexion"
2. Cliquer sur "S'inscrire"
3. Choisir **"Acheteur"**
4. Remplir: Nom, Email, Téléphone, Mot de passe
5. Cliquer "S'inscrire"

### Fonctionnalités:
✅ **Page d'accueil**: Voir tous les vendeurs
✅ **Produits**: Cliquer "Produits" dans le menu
   - Voir TOUS les produits de TOUS les vendeurs
   - **Filtrer par catégorie**: Cliquer sur une catégorie (Meubles, Électronique, Mode, etc.)
   - Trier par prix, note
✅ **Panier**: 
   - Ajouter des produits au panier
   - Cliquer sur l'icône panier
   - Commander
✅ **Favoris, Partage**: Boutons apparaissent au survol des produits

---

## 🏪 Pour les VENDEURS (Sellers)

### S'inscrire:
1. Cliquer sur "Connexion"
2. Cliquer sur "S'inscrire"
3. Choisir **"Vendeur"**
4. Remplir:
   - Nom complet
   - Email
   - Téléphone
   - **Nom de la boutique**
   - **Adresse de la boutique**
   - **Logo de la boutique** (Upload PNG/JPG)
   - Mot de passe
5. Cliquer "S'inscrire"
6. ✨ **Redirection automatique vers votre dashboard**

### Dashboard Vendeur (Ma Boutique):
✅ **Statistiques en haut**:
   - Revenu total
   - Nombre de commandes
   - Produits actifs

✅ **Ajouter un produit**:
   1. Cliquer "+ Ajouter Produit"
   2. Remplir:
      - Nom du produit
      - Prix
      - Catégorie (Meubles, Électronique, Mode, etc.)
      - Stock
      - Description
      - Réduction (optionnel)
      - **📸 IMAGE** (Upload PNG/JPG - PAS d'emoji!)
   3. Cliquer "Ajouter"

✅ **Gérer les produits**:
   - Tableau avec vos produits
   - **Modifier** (icône crayon)
   - **Supprimer** (icône poubelle)

✅ **Voir vos commandes**:
   - Tableau des commandes reçues
   - Voir les détails, statut

---

## 🎯 Flux complet de test

### Test Vendeur:
1. S'inscrire comme vendeur avec logo
2. Ajouter 3-5 produits avec **vraies images**
3. Vérifier que les produits apparaissent dans le tableau
4. Modifier un produit
5. Retour page d'accueil → Voir votre boutique dans la liste

### Test Acheteur:
1. S'inscrire comme acheteur
2. Aller sur "Produits"
3. Voir **tous les produits de tous les vendeurs**
4. Tester les filtres de catégorie (Meubles, Mode, etc.)
5. Ajouter des produits au panier
6. Passer commande

---

## ✨ Fonctionnalités principales

### Images partout:
- ✅ Logo des boutiques (vendeurs)
- ✅ Photos des produits (PNG/JPG upload)
- ✅ Base64 storage (pas besoin de serveur de fichiers)

### Séparation complète:
- 🔵 **Acheteurs** → Voient TOUS les produits de TOUS les vendeurs
- 🟢 **Vendeurs** → Dashboard avec SEULEMENT leurs produits et stats

### Filtrage intelligent:
- Par catégorie (8 catégories)
- Par prix (croissant/décroissant)
- Par note

---

## 🔐 Connexion

L'email et le mot de passe identifient automatiquement si vous êtes acheteur ou vendeur.
- **Vendeurs** → Redirigés vers "Ma Boutique"
- **Acheteurs** → Redirigés vers page d'accueil

---

## 🎨 Personnalisation

Tous les composants utilisent Tailwind CSS et sont facilement personnalisables dans:
- `frontend/src/components/`
- `frontend/src/pages/`

---

## 📦 Prêt pour le déploiement!

Le site est 100% fonctionnel et prêt à être déployé sur:
- **Frontend**: Vercel, Netlify, Render
- **Backend**: Render, Railway, Heroku
- **Base de données**: Pour production, remplacer la DB en mémoire par PostgreSQL/MongoDB
