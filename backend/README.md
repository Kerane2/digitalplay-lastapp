# Digital Play Backend API

Backend Express + TypeScript avec Supabase pour Digital Play.

## 🚀 Installation & Lancement

**Tout est déjà configuré !** Le fichier `.env` contient vos vraies clés Supabase.

\`\`\`bash
# 1. Aller dans le dossier backend
cd backend

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur
npm run dev
\`\`\`

✅ Le backend démarre sur **http://localhost:5000**

## 🏃‍♂️ Lancer le serveur

**Mode développement** (avec hot reload) :
\`\`\`bash
npm run dev
\`\`\`

**Mode production** :
\`\`\`bash
npm run build
npm start
\`\`\`

## 📁 Structure du projet

\`\`\`
backend/
├── src/
│   ├── config/          # Configuration (Supabase, DB)
│   ├── controllers/     # Logique des routes
│   ├── middleware/      # Authentification, erreurs
│   ├── routes/          # Définition des routes
│   └── server.ts        # Point d'entrée
├── .env.example         # Exemple de variables d'environnement
├── package.json
└── tsconfig.json
\`\`\`

## 🔐 Authentification

Le backend utilise JWT pour l'authentification. Voici comment l'utiliser :

### Inscription
\`\`\`bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
\`\`\`

### Connexion
\`\`\`bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

### Utiliser le token
Ajoutez le token dans le header Authorization :
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN
\`\`\`

## 📡 Routes disponibles

### Auth (`/api/auth`)
- `POST /register` - Créer un compte
- `POST /login` - Se connecter
- `POST /google` - Connexion Google OAuth
- `GET /me` - Infos utilisateur actuel (protégé)
- `POST /logout` - Se déconnecter (protégé)

### Products (`/api/products`)
- `GET /` - Liste tous les produits
- `GET /:id` - Détails d'un produit
- `POST /` - Créer un produit (admin)
- `PUT /:id` - Modifier un produit (admin)
- `DELETE /:id` - Supprimer un produit (admin)

### Categories (`/api/categories`)
- `GET /` - Liste toutes les catégories
- `GET /:id` - Détails d'une catégorie
- `POST /` - Créer une catégorie (admin)
- `PUT /:id` - Modifier une catégorie (admin)
- `DELETE /:id` - Supprimer une catégorie (admin)

### Orders (`/api/orders`)
- `POST /` - Créer une commande (protégé)
- `GET /my-orders` - Mes commandes (protégé)
- `GET /:id` - Détails d'une commande (protégé)
- `GET /` - Toutes les commandes (admin)
- `PUT /:id/status` - Modifier le statut (admin)

## 🔒 Niveaux de protection

- **Public** : Accessible sans authentification
- **Protégé** : Nécessite un token JWT valide
- **Admin** : Nécessite un token JWT + rôle admin

## 🛠️ Déploiement

Le backend peut être déployé sur :
- **Vercel** (avec serverless functions)
- **Railway**
- **Render**
- **DigitalOcean**
- **AWS EC2**

## 📝 Notes importantes

- Le backend utilise **Supabase** comme base de données
- L'authentification est faite avec **JWT**
- Les mots de passe sont hashés avec **bcrypt**
- CORS est configuré pour accepter uniquement votre frontend
