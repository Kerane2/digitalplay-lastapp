import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing required environment variables');
  console.error('Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in backend/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Categories from frontend
const categories = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Abonnements',
    slug: 'abonnements',
    description: 'Netflix, Spotify, VPN et plus encore',
    image_url: '/streaming-subscriptions.jpg',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Cartes Cadeaux',
    slug: 'cartes-cadeaux',
    description: 'PlayStation, Xbox, Nintendo, Steam et plus',
    image_url: '/gift-cards-elegant.jpg',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Recharges Jeux Mobile',
    slug: 'recharges-jeux-mobile',
    description: 'COD Mobile, PUBG, Free Fire, Mobile Legends',
    image_url: '/mobile-game-topups.jpg',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Accessoires Gaming',
    slug: 'accessoires-gaming',
    description: 'Manettes, claviers, souris et plus',
    image_url: '/gaming-accessories.jpg',
  },
];

// Sample of products (first 10 for quick test)
const products = [
  {
    category_id: '11111111-1111-1111-1111-111111111111',
    name: 'Netflix Premium',
    slug: 'netflix-premium-1-mois',
    description: 'Abonnement Netflix Premium 1 mois pour profiter de milliers de films et séries en streaming Ultra HD.',
    price: 8000,
    stock: 100,
    platform: 'Streaming',
    region: 'Global',
    type: 'digital',
    image_url: '/netflix-subscription.jpg',
    is_featured: true,
  },
  {
    category_id: '11111111-1111-1111-1111-111111111111',
    name: 'Disney+ Premium',
    slug: 'disney-plus-1-mois',
    description: 'Tout l\'univers Disney, Pixar, Marvel, Star Wars et National Geographic pendant 1 mois.',
    price: 7500,
    stock: 100,
    platform: 'Streaming',
    region: 'Global',
    type: 'digital',
    image_url: '/disney-plus.jpg',
    is_featured: true,
  },
  {
    category_id: '11111111-1111-1111-1111-111111111111',
    name: 'Spotify Premium',
    slug: 'spotify-premium-1-mois',
    description: 'Millions de chansons et podcasts sans publicité avec Spotify Premium pendant 1 mois.',
    price: 5000,
    stock: 100,
    platform: 'Streaming',
    region: 'Global',
    type: 'digital',
    image_url: '/spotify-premium.jpg',
    is_featured: true,
  },
  {
    category_id: '11111111-1111-1111-1111-111111111111',
    name: 'NordVPN',
    slug: 'nordvpn',
    description: 'Naviguez en toute sécurité avec NordVPN, le meilleur VPN du marché.',
    price: 9000,
    stock: 100,
    platform: 'VPN',
    region: 'Global',
    type: 'digital',
    image_url: '/nordvpn.jpg',
    is_featured: true,
  },
  {
    category_id: '22222222-2222-2222-2222-222222222222',
    name: 'PlayStation',
    slug: 'playstation-10',
    description: 'Carte cadeau PlayStation Store pour acheter jeux et contenus.',
    price: 10000,
    stock: 200,
    platform: 'PlayStation',
    region: 'Global',
    type: 'digital',
    image_url: '/playstation-gift-card.png',
    is_featured: true,
  },
  {
    category_id: '22222222-2222-2222-2222-222222222222',
    name: 'Xbox',
    slug: 'xbox-15',
    description: 'Carte cadeau Xbox pour le Microsoft Store et Game Pass.',
    price: 10000,
    stock: 200,
    platform: 'Xbox',
    region: 'Global',
    type: 'digital',
    image_url: '/xbox-gift-card.png',
    is_featured: true,
  },
  {
    category_id: '22222222-2222-2222-2222-222222222222',
    name: 'Steam Wallet',
    slug: 'steam-wallet',
    description: 'Code Steam Wallet pour votre compte Steam.',
    price: 10000,
    stock: 300,
    platform: 'PC',
    region: 'Global',
    type: 'digital',
    image_url: '/steam-gift-card.png',
    is_featured: true,
  },
  {
    category_id: '33333333-3333-3333-3333-333333333333',
    name: 'COD Mobile (CP)',
    slug: 'cod-mobile-1100-cp',
    description: 'COD Points pour Call of Duty Mobile.',
    price: 5000,
    stock: 200,
    platform: 'Mobile',
    region: 'Global',
    type: 'digital',
    image_url: '/cod-mobile-cp.jpg',
    is_featured: true,
  },
  {
    category_id: '33333333-3333-3333-3333-333333333333',
    name: 'PUBG Mobile (UC)',
    slug: 'pubg-660-uc',
    description: 'Unknown Cash (UC) pour PUBG Mobile.',
    price: 5000,
    stock: 200,
    platform: 'Mobile',
    region: 'Global',
    type: 'digital',
    image_url: '/pubg-mobile-uc.jpg',
    is_featured: true,
  },
  {
    category_id: '44444444-4444-4444-4444-444444444444',
    name: 'Manette PS5 DualSense',
    slug: 'ps5-dualsense',
    description: 'Manette sans fil officielle PlayStation 5 DualSense avec retour haptique et gâchettes adaptatives.',
    price: 55000,
    stock: 25,
    platform: 'PlayStation 5',
    region: 'Global',
    type: 'physical',
    image_url: '/dualsense-controller.png',
    is_featured: true,
  },
];

async function syncData() {
  console.log('Starting data synchronization...\n');

  // Insert categories
  console.log('Inserting categories...');
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'id' })
    .select();

  if (categoriesError) {
    console.error('Error inserting categories:', categoriesError);
  } else {
    console.log(`Successfully inserted ${categoriesData?.length || 0} categories`);
  }

  // Insert products
  console.log('\nInserting products...');
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .insert(products)
    .select();

  if (productsError) {
    console.error('Error inserting products:', productsError);
  } else {
    console.log(`Successfully inserted ${productsData?.length || 0} products`);
  }

  console.log('\nData synchronization complete!');
  console.log('You can now refresh your frontend to see the products.');

  process.exit(0);
}

syncData();
