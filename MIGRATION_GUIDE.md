# Guide de Migration - Digital Play

Votre projet local utilise une structure différente avec `src/` et NextAuth. Voici comment migrer les fichiers:

## Problèmes à Corriger

### 1. Structure des Fichiers

Votre projet local utilise:
- `src/app/` au lieu de `app/`
- `src/lib/` au lieu de `lib/`
- `src/components/` au lieu de `components/`

### 2. Erreur: Module not found '@/lib/auth'

Dans votre projet local, créez le fichier `src/lib/auth.ts`:

\`\`\`typescript
// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
        session.user.role = user.role || 'customer';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
\`\`\`

### 3. Erreur: params should be awaited

Pour `src/app/produit/[slug]/page.tsx`:

\`\`\`typescript
// AVANT (incorrect)
export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  // ...
}

// APRÈS (correct pour Next.js 15/16)
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  // ...
}
\`\`\`

Pour `src/app/categorie/[category]/page.tsx`:

\`\`\`typescript
// AVANT (incorrect)
export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  // ...
}

// APRÈS (correct pour Next.js 15/16)
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  // ...
}
\`\`\`

### 4. Images Manquantes

Les erreurs 404 pour les images indiquent que vous devez ajouter les images dans:
- `public/images/produits/streaming/`
- `public/images/produits/cartes/`
- `public/images/produits/recharges/`
- `public/images/produits/accessoires/`
- `public/images/bannieres/`

Les images au format `.webp` sont préférables pour la performance.

### 5. Erreur PostgreSQL Connection

L'erreur `Error in PostgreSQL connection: Error { kind: Closed, cause: None }` indique:
- Vérifiez votre variable `DATABASE_URL` dans `.env`
- Assurez-vous que votre base de données Neon/Supabase est accessible
- Redémarrez le serveur si la connexion a expiré

## Commandes Utiles

\`\`\`bash
# Si vous avez des erreurs d'installation
npm install --legacy-peer-deps

# Pour recréer les tables
npx prisma db push

# Pour voir l'état de la base de données
npx prisma studio
\`\`\`

## Résumé des Changements Requis

1. ✅ Créer `src/lib/auth.ts` avec authOptions
2. ✅ Changer les pages dynamiques en `async` et `await params`
3. ✅ Ajouter les images manquantes dans `public/images/`
4. ✅ Vérifier la connexion à la base de données
