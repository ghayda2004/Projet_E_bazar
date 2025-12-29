# Services

Ce dossier contient les services pour gérer les appels API et la logique métier.

## Structure

- `config.ts` - Configuration API et helpers
- `authService.ts` - Gestion de l'authentification
- `productService.ts` - Gestion des produits
- `orderService.ts` - Gestion des commandes
- `contactService.ts` - Gestion du formulaire de contact
- `api.ts` - Integration avec Fake Store API (optionnel)

## Services Implémentés

### authService.ts
- `register()` - Inscription utilisateur
- `login()` - Connexion utilisateur
- `logout()` - Déconnexion
- `getProfile()` - Récupérer le profil
- `updateProfile()` - Mettre à jour le profil

### productService.ts
- `getProducts()` - Récupérer tous les produits
- `getProduct()` - Récupérer un produit
- `getSellerProducts()` - Produits du vendeur
- `createProduct()` - Créer un produit
- `updateProduct()` - Modifier un produit
- `deleteProduct()` - Supprimer un produit

### orderService.ts
- `createOrder()` - Créer une commande
- `getUserOrders()` - Commandes de l'utilisateur
- `getSellerOrders()` - Commandes du vendeur
- `updateOrderStatus()` - Modifier le statut

### contactService.ts
- `submitContact()` - Envoyer le formulaire de contact
