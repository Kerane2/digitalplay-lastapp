# Frontend-Backend Connection Guide

## Configuration

Le frontend Next.js communique maintenant avec le backend Express via l'API REST.

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec :

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

### Architecture

\`\`\`
Frontend (Next.js) → API Client → Backend (Express) → Supabase
http://localhost:3000   lib/api-client.ts   http://localhost:5000   Database
\`\`\`

### Fonctionnalités connectées

✅ **Produits**
- Liste des produits : GET `/api/products`
- Détail produit : GET `/api/products/:id`
- Créer produit (admin) : POST `/api/products`
- Modifier produit (admin) : PUT `/api/products/:id`
- Supprimer produit (admin) : DELETE `/api/products/:id`

✅ **Catégories**
- Liste des catégories : GET `/api/categories`
- Détail catégorie : GET `/api/categories/:id`
- Créer catégorie (admin) : POST `/api/categories`
- Modifier catégorie (admin) : PUT `/api/categories/:id`
- Supprimer catégorie (admin) : DELETE `/api/categories/:id`

✅ **Authentification**
- Login : POST `/api/auth/login`
- Register : POST `/api/auth/register`
- Me : GET `/api/auth/me`

✅ **Commandes**
- Liste commandes (authentifié) : GET `/api/orders`
- Détail commande : GET `/api/orders/:id`
- Créer commande : POST `/api/orders`

### Fallback localStorage

Si le backend n'est pas disponible, l'API client utilise automatiquement localStorage avec des données mockées pour permettre de continuer le développement frontend.

### Démarrage

1. **Backend** : 
   \`\`\`bash
   cd backend
   npm run dev
   \`\`\`
   Backend disponible sur http://localhost:5000

2. **Frontend** :
   \`\`\`bash
   npm run dev
   \`\`\`
   Frontend disponible sur http://localhost:3000

3. **Admin Dashboard** :
   Accédez à http://localhost:5000/admin pour gérer les produits

### Test de connexion

Vérifiez que le frontend communique avec le backend :
1. Ouvrez http://localhost:3000
2. Ouvrez les DevTools (F12) → Network
3. Rechargez la page
4. Vous devriez voir les requêtes vers `http://localhost:5000/api/products` et `/api/categories`

Si les requêtes échouent, vérifiez que le backend est bien démarré sur le port 5000.
