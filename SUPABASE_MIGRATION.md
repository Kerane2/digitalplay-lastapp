# Migration de Neon vers Supabase - Digital Play

Ce document explique comment votre projet a été migré de Neon vers Supabase.

## Ce qui a changé

### 1. Base de données
- **Avant** : Neon PostgreSQL
- **Maintenant** : Supabase PostgreSQL

### 2. Clients de base de données
- **Avant** : `import { sql } from '@/lib/db'` (Neon)
- **Maintenant** : `import { createClient } from '@/lib/supabase/server'` ou `'@/lib/supabase/client'`

### 3. Authentification
- **Avant** : JWT personnalisé
- **Maintenant** : Supabase Auth (intégré)

## Structure des fichiers

### Nouveaux fichiers créés :

\`\`\`
lib/
├── supabase/
│   ├── client.ts          # Client Supabase côté navigateur
│   ├── server.ts          # Client Supabase côté serveur
│   └── middleware.ts      # Gestion de l'authentification
middleware.ts              # Point d'entrée du middleware
\`\`\`

### Fichiers modifiés :

\`\`\`
lib/db.ts                  # Maintenant utilise Supabase (garde export sql pour compatibilité)
BACKEND_INTEGRATION.md     # Guide mis à jour pour Supabase
\`\`\`

## Variables d'environnement

Assurez-vous que votre `.env.local` contient :

\`\`\`env
# Supabase (OBLIGATOIRE)
NEXT_PUBLIC_SUPABASE_URL=https://bveeptjivumvrsqkxxih.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google OAuth (optionnel si vous utilisez Google)
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret

# Backend API personnalisé (optionnel)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

## Comment utiliser Supabase

### Côté client (composants React)

\`\`\`typescript
'use client'

import { createClient } from '@/lib/supabase/client'

export default function MyComponent() {
  const supabase = createClient()
  
  // Récupérer des données
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(10)
    
    if (error) console.error(error)
    return data
  }
  
  // Authentification
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
  }
  
  return <div>...</div>
}
\`\`\`

### Côté serveur (Server Components, API Routes)

\`\`\`typescript
import { createClient } from '@/lib/supabase/server'

export default async function MyPage() {
  const supabase = await createClient()
  
  // Vérifier l'utilisateur
  const { data: { user } } = await supabase.auth.getUser()
  
  // Récupérer des données
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
  
  return <div>{/* Afficher les produits */}</div>
}
\`\`\`

### Dans les API Routes

\`\`\`typescript
// app/api/products/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
\`\`\`

## Row Level Security (RLS)

Supabase utilise RLS pour sécuriser les données. Vous DEVEZ activer les policies :

### Activer RLS sur vos tables

\`\`\`sql
-- Activer RLS
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy : les utilisateurs voient uniquement leur panier
CREATE POLICY "Users can view their own cart"
  ON cart FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to their cart"
  ON cart FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy : les utilisateurs voient uniquement leurs commandes
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Policy : tout le monde peut voir les produits
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

-- Policy : seuls les admins peuvent modifier les produits
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
\`\`\`

## Authentification

### Inscription

\`\`\`typescript
const supabase = createClient()

const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    emailRedirectTo: `${window.location.origin}/`,
    data: {
      full_name: 'John Doe'
    }
  }
})
\`\`\`

### Connexion

\`\`\`typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
\`\`\`

### Google OAuth

\`\`\`typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/`
  }
})
\`\`\`

### Déconnexion

\`\`\`typescript
await supabase.auth.signOut()
\`\`\`

### Vérifier l'utilisateur connecté

\`\`\`typescript
// Côté client
const { data: { user } } = await supabase.auth.getUser()

// Côté serveur
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
\`\`\`

## Middleware

Le middleware vérifie automatiquement l'authentification sur toutes les routes et redirige vers `/login` si nécessaire.

Vous pouvez personnaliser les routes protégées dans `lib/supabase/middleware.ts` :

\`\`\`typescript
// Redirect to login if not authenticated and trying to access protected routes
if (
  !user &&
  (request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/checkout") ||
    request.nextUrl.pathname.startsWith("/orders"))
) {
  const url = request.nextUrl.clone()
  url.pathname = "/login"
  return NextResponse.redirect(url)
}
\`\`\`

## API Routes existantes

Les routes API dans `app/api/` utilisent encore `import { sql } from '@/lib/db'`. 

**Vous avez 2 options :**

### Option 1 : Supprimer ces routes (RECOMMANDÉ)
Si vous créez votre propre backend, supprimez le dossier `app/api/` :
\`\`\`bash
rm -rf app/api
\`\`\`

### Option 2 : Les migrer vers Supabase
Remplacez les appels SQL par Supabase :

**Avant (Neon) :**
\`\`\`typescript
import { sql } from '@/lib/db'

const products = await sql`
  SELECT * FROM products WHERE category_id = ${categoryId}
`
\`\`\`

**Après (Supabase) :**
\`\`\`typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('category_id', categoryId)
\`\`\`

## Déploiement

Sur Vercel, ajoutez ces variables d'environnement :

1. **Project Settings** → **Environment Variables**
2. Ajoutez :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase avec Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## Checklist

- [ ] Variables d'environnement Supabase ajoutées à `.env.local`
- [ ] Dépendances installées : `npm install @supabase/supabase-js @supabase/ssr`
- [ ] RLS activé sur les tables sensibles
- [ ] Policies RLS créées
- [ ] Middleware configuré
- [ ] Test de connexion réussi
- [ ] Routes API migrées ou supprimées (selon votre choix)
- [ ] Google OAuth configuré (si nécessaire)

Votre projet est maintenant prêt à utiliser Supabase !
