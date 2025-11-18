# Guide Complet d'Intégration Backend - Digital Play

Ce document explique **EXACTEMENT** ce que vous devez faire pour connecter votre backend au frontend Digital Play.

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble du système](#vue-densemble-du-système)
2. [Configuration initiale](#configuration-initiale)
3. [Authentification Google OAuth](#authentification-google-oauth)
4. [Routes API à créer](#routes-api-à-créer)
5. [Format des données](#format-des-données)
6. [Schéma de base de données](#schéma-de-base-de-données)
7. [Flux complets](#flux-complets)

---

## 🎯 VUE D'ENSEMBLE DU SYSTÈME

### Ce que le frontend fait actuellement :
- Utilise **localStorage** comme fallback temporaire
- Essaie d'appeler des routes API si `NEXT_PUBLIC_API_URL` est défini
- Si l'API échoue, utilise localStorage automatiquement

### Ce que vous devez faire :
1. Créer votre backend avec les routes listées ci-dessous
2. Ajouter `NEXT_PUBLIC_API_URL` dans `.env.local`
3. Le frontend appellera automatiquement votre backend

---

## ⚙️ CONFIGURATION INITIALE

### 1. Créer le fichier `.env.local` à la racine du projet

\`\`\`env
# URL de votre backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Base URL du site (pour les redirections)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google OAuth (vous avez déjà ces clés)
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret

# JWT Secret pour signer les tokens (générez une chaîne aléatoire)
JWT_SECRET=votre_secret_jwt_super_secure_123456

# Base de données (Neon PostgreSQL - vous avez déjà ça)
DATABASE_URL=postgresql://...
\`\`\`

### 2. Structure attendue de votre backend

\`\`\`
votre-backend/
├── routes/
│   ├── auth.js          # Routes d'authentification
│   ├── products.js      # Routes produits
│   ├── categories.js    # Routes catégories
│   ├── orders.js        # Routes commandes
│   └── cart.js          # Routes panier
├── controllers/
├── models/
└── server.js
\`\`\`

---

## 🔐 AUTHENTIFICATION GOOGLE OAUTH

### Comment ça fonctionne actuellement :

1. **L'utilisateur clique sur "Continuer avec Google"**
2. **Le frontend redirige vers Google** avec ces paramètres :
   \`\`\`
   https://accounts.google.com/o/oauth2/v2/auth?
     client_id=VOTRE_GOOGLE_CLIENT_ID
     &redirect_uri=http://localhost:3000/api/auth/callback/google
     &response_type=code
     &scope=openid email profile
   \`\`\`

3. **Google redirige vers votre callback** : `/api/auth/callback/google?code=XXXXX`

4. **Vous devez créer cette route dans Next.js** (ou dans votre backend)

### Option 1 : Gérer OAuth dans Next.js (RECOMMANDÉ)

Créez le fichier : `app/api/auth/callback/google/route.ts`

\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    // 1. Échanger le code contre un access token Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    // 2. Récupérer les infos utilisateur de Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json();

    // 3. Appeler VOTRE backend pour créer/connecter l'utilisateur
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
        picture: googleUser.picture,
      }),
    });

    const { user, token } = await backendResponse.json();

    // 4. Stocker le token JWT et rediriger
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return response;

  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}
\`\`\`

### Ce que votre backend doit faire :

**Route backend : `POST /api/auth/google`**

\`\`\`javascript
// Exemple Node.js/Express
router.post('/auth/google', async (req, res) => {
  const { email, name, googleId, picture } = req.body;

  try {
    // 1. Vérifier si l'utilisateur existe déjà
    let user = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    // 2. Si non, créer un nouveau compte
    if (user.rows.length === 0) {
      user = await db.query(
        `INSERT INTO users (id, email, full_name, google_id, avatar_url, role, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, 'customer', NOW())
         RETURNING *`,
        [email, name, googleId, picture]
      );
    }

    const userData = user.rows[0];

    // 3. Générer un JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        userId: userData.id, 
        email: userData.email, 
        role: userData.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. Retourner l'utilisateur et le token
    res.json({
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.full_name,
        role: userData.role,
        avatar: userData.avatar_url,
      },
      token
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});
\`\`\`

---

## 🛣️ ROUTES API À CRÉER

### 1. AUTHENTIFICATION

#### `POST /api/auth/register`
**Ce que le frontend envoie :**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
\`\`\`

**Ce que vous devez retourner :**
\`\`\`json
{
  "user": {
    "id": "uuid-xxx",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  },
  "token": "jwt_token_xxx"
}
\`\`\`

**Ce que votre backend doit faire :**
1. Vérifier que l'email n'existe pas déjà
2. Hasher le mot de passe (bcrypt)
3. Créer l'utilisateur dans la DB
4. Générer un JWT token
5. Retourner user + token

---

#### `POST /api/auth/login`
**Ce que le frontend envoie :**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Ce que vous devez retourner :**
\`\`\`json
{
  "user": {
    "id": "uuid-xxx",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  },
  "token": "jwt_token_xxx"
}
\`\`\`

**Ce que votre backend doit faire :**
1. Trouver l'utilisateur par email
2. Vérifier le mot de passe (bcrypt.compare)
3. Générer un JWT token
4. Retourner user + token

---

#### `POST /api/auth/google`
Voir la section OAuth ci-dessus.

---

#### `GET /api/auth/me`
**Headers requis :**
\`\`\`
Authorization: Bearer jwt_token_xxx
\`\`\`

**Ce que vous devez retourner :**
\`\`\`json
{
  "id": "uuid-xxx",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "customer",
  "avatar": "https://..."
}
\`\`\`

**Ce que votre backend doit faire :**
1. Vérifier le JWT token
2. Récupérer l'utilisateur depuis la DB
3. Retourner ses infos

---

#### `POST /api/auth/logout`
**Ce que le frontend envoie :**
Juste le token dans les headers

**Ce que vous devez retourner :**
\`\`\`json
{
  "message": "Logged out successfully"
}
\`\`\`

**Ce que votre backend doit faire :**
1. Invalider le token (blacklist ou réduire l'expiration)
2. Confirmer la déconnexion

---

### 2. PRODUITS

#### `GET /api/products`
**Paramètres optionnels (query params) :**
- `category` : filtrer par slug de catégorie
- `search` : rechercher dans nom/description
- `featured` : true/false pour produits mis en avant
- `limit` : nombre de résultats
- `offset` : pagination

**Exemple d'appel :**
\`\`\`
GET /api/products?category=abonnements&limit=10&offset=0
\`\`\`

**Ce que vous devez retourner :**
\`\`\`json
[
  {
    "id": "uuid-xxx",
    "name": "Netflix Premium 1 Mois",
    "slug": "netflix-premium-1-mois",
    "description": "Profitez de Netflix...",
    "price": 8000,
    "stock": 50,
    "platform": "Web",
    "region": "Global",
    "type": "digital",
    "image_url": "/netflix.jpg",
    "is_featured": true,
    "category_id": "uuid-yyy",
    "category_name": "Abonnements",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
\`\`\`

---

#### `GET /api/products/:id`
**Ce que vous devez retourner :**
\`\`\`json
{
  "id": "uuid-xxx",
  "name": "Netflix Premium 1 Mois",
  "slug": "netflix-premium-1-mois",
  "description": "Profitez de Netflix Premium...",
  "price": 8000,
  "stock": 50,
  "platform": "Web",
  "region": "Global",
  "type": "digital",
  "image_url": "/netflix.jpg",
  "is_featured": true,
  "category_id": "uuid-yyy",
  "category_name": "Abonnements"
}
\`\`\`

---

#### `POST /api/products` (ADMIN UNIQUEMENT)
**Headers requis :**
\`\`\`
Authorization: Bearer jwt_token_xxx
\`\`\`

**Ce que le frontend envoie :**
\`\`\`json
{
  "name": "Nouveau Produit",
  "slug": "nouveau-produit",
  "description": "Description du produit",
  "price": 15000,
  "stock": 100,
  "platform": "PC",
  "region": "Global",
  "type": "digital",
  "image_url": "/image.jpg",
  "is_featured": false,
  "category_id": "uuid-yyy"
}
\`\`\`

**Ce que vous devez retourner :**
Le produit créé (même format que GET)

**Ce que votre backend doit faire :**
1. Vérifier que l'utilisateur est admin (via JWT)
2. Valider les données
3. Insérer dans la DB
4. Retourner le produit créé

---

#### `PUT /api/products/:id` (ADMIN UNIQUEMENT)
**Ce que le frontend envoie :**
\`\`\`json
{
  "name": "Produit Modifié",
  "price": 20000,
  "stock": 150
  // Tous les champs modifiables
}
\`\`\`

**Ce que vous devez retourner :**
Le produit mis à jour

---

#### `DELETE /api/products/:id` (ADMIN UNIQUEMENT)
**Ce que vous devez retourner :**
\`\`\`json
{
  "message": "Product deleted successfully"
}
\`\`\`

---

### 3. CATÉGORIES

#### `GET /api/categories`
**Ce que vous devez retourner :**
\`\`\`json
[
  {
    "id": "uuid-xxx",
    "name": "Abonnements",
    "slug": "abonnements",
    "description": "Abonnements streaming et services en ligne",
    "image_url": "/streaming.jpg",
    "product_count": 15
  }
]
\`\`\`

---

#### `POST /api/categories` (ADMIN UNIQUEMENT)
**Ce que le frontend envoie :**
\`\`\`json
{
  "name": "Nouvelle Catégorie",
  "slug": "nouvelle-categorie",
  "description": "Description",
  "image_url": "/image.jpg"
}
\`\`\`

---

#### `PUT /api/categories/:id` (ADMIN UNIQUEMENT)
#### `DELETE /api/categories/:id` (ADMIN UNIQUEMENT)

---

### 4. PANIER

#### `GET /api/cart`
**Headers requis :**
\`\`\`
Authorization: Bearer jwt_token_xxx
\`\`\`

**Ce que vous devez retourner :**
\`\`\`json
{
  "items": [
    {
      "id": "uuid-xxx",
      "product_id": "uuid-yyy",
      "product_name": "Netflix Premium 1 Mois",
      "product_price": 8000,
      "product_image": "/netflix.jpg",
      "quantity": 2
    }
  ],
  "total": 16000
}
\`\`\`

---

#### `POST /api/cart`
**Ce que le frontend envoie :**
\`\`\`json
{
  "product_id": "uuid-xxx",
  "quantity": 1
}
\`\`\`

**Ce que vous devez retourner :**
Le panier mis à jour (même format que GET)

---

#### `PUT /api/cart/:item_id`
**Ce que le frontend envoie :**
\`\`\`json
{
  "quantity": 3
}
\`\`\`

---

#### `DELETE /api/cart/:item_id`
**Ce que vous devez retourner :**
\`\`\`json
{
  "message": "Item removed from cart"
}
\`\`\`

---

### 5. COMMANDES

#### `GET /api/orders`
**Headers requis :**
\`\`\`
Authorization: Bearer jwt_token_xxx
\`\`\`

**Ce que vous devez retourner :**
\`\`\`json
[
  {
    "id": "uuid-xxx",
    "order_number": "DP-2024-00001",
    "user_id": "uuid-yyy",
    "total_amount": 16000,
    "status": "pending",
    "payment_method": "mobile_money",
    "phone_number": "+243123456789",
    "created_at": "2024-01-15T10:30:00Z",
    "items": [
      {
        "product_name": "Netflix Premium 1 Mois",
        "quantity": 2,
        "price": 8000
      }
    ]
  }
]
\`\`\`

**Statuts possibles :**
- `pending` : En attente de paiement
- `paid` : Payé
- `processing` : En cours de traitement
- `completed` : Livré/Complété
- `cancelled` : Annulé

---

#### `POST /api/orders`
**Ce que le frontend envoie :**
\`\`\`json
{
  "items": [
    {
      "product_id": "uuid-xxx",
      "quantity": 2,
      "price": 8000
    }
  ],
  "total_amount": 16000,
  "payment_method": "mobile_money",
  "phone_number": "+243123456789",
  "email": "user@example.com",
  "full_name": "John Doe"
}
\`\`\`

**Ce que vous devez retourner :**
\`\`\`json
{
  "order_id": "uuid-xxx",
  "order_number": "DP-2024-00001",
  "status": "pending",
  "message": "Order created successfully"
}
\`\`\`

**Ce que votre backend doit faire :**
1. Créer la commande dans la DB
2. Générer un numéro de commande unique
3. Créer les order_items
4. Réduire le stock des produits
5. (Optionnel) Envoyer un email de confirmation
6. (Optionnel) Initier le paiement Mobile Money

---

#### `GET /api/orders/:id`
**Ce que vous devez retourner :**
Une commande individuelle (même format que GET /api/orders mais un seul objet)

---

#### `PUT /api/orders/:id` (ADMIN UNIQUEMENT)
**Ce que le frontend envoie :**
\`\`\`json
{
  "status": "completed"
}
\`\`\`

**Ce que vous devez retourner :**
La commande mise à jour

---

### 6. ADMIN DASHBOARD

#### `GET /api/admin/stats`
**Headers requis :**
\`\`\`
Authorization: Bearer jwt_token_xxx (admin role)
\`\`\`

**Ce que vous devez retourner :**
\`\`\`json
{
  "total_orders": 150,
  "total_revenue": 2500000,
  "total_customers": 87,
  "pending_orders": 12,
  "recent_orders": [
    {
      "id": "uuid-xxx",
      "order_number": "DP-2024-00150",
      "customer_name": "John Doe",
      "total_amount": 16000,
      "status": "pending",
      "created_at": "2024-01-15T14:30:00Z"
    }
  ]
}
\`\`\`

---

## 📊 SCHÉMA DE BASE DE DONNÉES

Vous avez déjà les scripts SQL dans votre projet. Voici les tables principales :

### Table `users`
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'customer', -- 'customer' ou 'admin'
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Table `categories`
\`\`\`sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Table `products`
\`\`\`sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- En centimes (8000 = 80 FCFA)
  stock INTEGER DEFAULT 0,
  platform VARCHAR(100),
  region VARCHAR(100),
  type VARCHAR(50), -- 'digital' ou 'physical'
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Table `orders`
\`\`\`sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(100),
  phone_number VARCHAR(20),
  email VARCHAR(255),
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Table `order_items`
\`\`\`sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255),
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL
);
\`\`\`

### Table `cart`
\`\`\`sql
CREATE TABLE cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

---

## 🔄 FLUX COMPLETS

### FLUX 1 : Inscription classique

1. **Utilisateur remplit le formulaire** (`app/register/page.tsx`)
2. **Frontend appelle** : `POST /api/auth/register`
3. **Backend** :
   - Vérifie que l'email n'existe pas
   - Hash le mot de passe avec bcrypt
   - INSERT dans users
   - Génère un JWT
   - Retourne user + token
4. **Frontend** :
   - Stocke le token en localStorage
   - Met à jour le contexte auth
   - Redirige vers la page d'accueil

---

### FLUX 2 : Connexion avec Google

1. **Utilisateur clique sur "Continuer avec Google"**
2. **Frontend redirige** vers Google OAuth
3. **Google redirige** vers `/api/auth/callback/google?code=XXX`
4. **Next.js callback** :
   - Échange le code contre un access token
   - Récupère les infos utilisateur de Google
   - Appelle `POST /api/auth/google` (votre backend)
5. **Votre backend** :
   - Cherche l'utilisateur par email
   - Si existe pas, créé un nouveau compte
   - Génère un JWT
   - Retourne user + token
6. **Next.js callback** :
   - Stocke le token en cookie
   - Redirige vers la page d'accueil

---

### FLUX 3 : Ajout au panier

1. **Utilisateur clique sur "Ajouter au panier"**
2. **Frontend appelle** : `POST /api/cart`
   \`\`\`json
   {
     "product_id": "uuid-xxx",
     "quantity": 1
   }
   \`\`\`
3. **Backend** :
   - Vérifie que l'utilisateur est connecté (JWT)
   - Vérifie que le produit existe et a du stock
   - INSERT dans cart (ou UPDATE quantity si déjà présent)
   - Retourne le panier mis à jour
4. **Frontend** :
   - Met à jour l'icône du panier (badge)
   - Affiche une notification de succès

---

### FLUX 4 : Passer une commande

1. **Utilisateur va sur la page checkout** (`app/checkout/page.tsx`)
2. **Frontend charge le panier** : `GET /api/cart`
3. **Utilisateur remplit les infos de paiement**
4. **Frontend appelle** : `POST /api/orders`
5. **Backend** :
   - Crée la commande dans orders
   - Crée les order_items
   - Réduit le stock des produits
   - Vide le panier de l'utilisateur
   - (Optionnel) Initie le paiement Mobile Money
   - Retourne l'order_id
6. **Frontend** :
   - Redirige vers la page de confirmation
   - Affiche le numéro de commande

---

### FLUX 5 : Admin gère les commandes

1. **Admin va sur** `/admin/orders`
2. **Frontend appelle** : `GET /api/orders` (avec filtre admin)
3. **Backend** :
   - Vérifie que l'utilisateur est admin (JWT role)
   - Retourne TOUTES les commandes (pas juste celles de l'utilisateur)
4. **Admin change le statut d'une commande**
5. **Frontend appelle** : `PUT /api/orders/:id`
   \`\`\`json
   {
     "status": "completed"
   }
   \`\`\`
6. **Backend** :
   - UPDATE orders SET status
   - (Optionnel) Envoie un email au client
   - Retourne la commande mise à jour

---

## 🔒 SÉCURITÉ

### Middleware d'authentification (backend)

\`\`\`javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { authenticateToken, requireAdmin };
\`\`\`

**Utilisation :**
\`\`\`javascript
router.get('/api/orders', authenticateToken, getOrders);
router.post('/api/products', authenticateToken, requireAdmin, createProduct);
\`\`\`

---

## 📱 PAIEMENT MOBILE MONEY (Optionnel)

Si vous voulez intégrer le paiement Mobile Money, voici la structure :

### Services populaires en Afrique :
- **Airtel Money**
- **Orange Money**
- **M-Pesa**
- **Flutterwave** (agrégateur)

### Flux avec Flutterwave (exemple) :

1. **Après création de la commande** :
\`\`\`javascript
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(PUBLIC_KEY, SECRET_KEY);

const payload = {
  tx_ref: order.order_number,
  amount: order.total_amount / 100, // Convertir en FCFA
  currency: "XAF", // ou "CDF" pour le Congo
  payment_type: "mobilemoney",
  redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify`,
  customer: {
    email: order.email,
    phonenumber: order.phone_number,
    name: order.full_name,
  },
};

const response = await flw.MobileMoney.charge(payload);
// Retourner l'URL de paiement au frontend
\`\`\`

2. **Frontend redirige** l'utilisateur vers l'URL Flutterwave
3. **Après paiement**, Flutterwave redirige vers votre callback
4. **Votre backend vérifie** le paiement et update le statut

---

## ✅ CHECKLIST COMPLÈTE

### Configuration
- [ ] Créer `.env.local` avec toutes les variables
- [ ] Installer les dépendances : `npm install`
- [ ] Lancer le projet : `npm run dev`

### Backend
- [ ] Créer la base de données PostgreSQL
- [ ] Exécuter les migrations SQL (tables)
- [ ] Créer les routes d'authentification
- [ ] Créer les routes produits
- [ ] Créer les routes catégories
- [ ] Créer les routes panier
- [ ] Créer les routes commandes
- [ ] Créer les routes admin
- [ ] Ajouter le middleware d'authentification JWT
- [ ] Tester toutes les routes avec Postman

### Google OAuth
- [ ] Créer le fichier `app/api/auth/callback/google/route.ts`
- [ ] Tester la connexion Google

### Frontend
- [ ] Ajouter `NEXT_PUBLIC_API_URL` dans `.env.local`
- [ ] Vérifier que les appels API fonctionnent
- [ ] Tester l'inscription classique
- [ ] Tester la connexion classique
- [ ] Tester la connexion Google
- [ ] Tester l'ajout au panier
- [ ] Tester le passage de commande
- [ ] Tester l'espace admin

### Optionnel
- [ ] Intégrer le paiement Mobile Money
- [ ] Ajouter l'envoi d'emails (confirmation commande)
- [ ] Ajouter les notifications WhatsApp
- [ ] Optimiser les images
- [ ] Ajouter un système de promo/coupons

---

## 🆘 AIDE & DEBUGGING

### Le frontend n'appelle pas mon backend
**Vérifiez :**
- `NEXT_PUBLIC_API_URL` est bien défini dans `.env.local`
- Redémarrez le serveur Next.js après avoir modifié `.env.local`
- Ouvrez la console du navigateur et vérifiez les requêtes (Network tab)

### Erreur CORS
**Ajoutez dans votre backend :**
\`\`\`javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
\`\`\`

### JWT invalide ou expiré
**Vérifiez :**
- Le `JWT_SECRET` est le même partout
- Le token n'a pas expiré (vérifiez l'expiration dans le payload)
- Le format du header est correct : `Authorization: Bearer TOKEN`

### Google OAuth ne fonctionne pas
**Vérifiez :**
- Les URL de redirection dans Google Cloud Console
- Les variables `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`
- L'URL de callback : `http://localhost:3000/api/auth/callback/google`

---

## 📞 CONTACT

Si vous avez des questions ou des problèmes, vous pouvez :
1. Consulter la documentation Next.js : https://nextjs.org/docs
2. Consulter la documentation JWT : https://jwt.io
3. Consulter la documentation Google OAuth : https://developers.google.com/identity/protocols/oauth2

---

**Bon courage ! 🚀**
