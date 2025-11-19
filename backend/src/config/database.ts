import { supabaseAdmin } from './supabase';

export const initializeDatabase = async () => {
  try {
    // Vérifier la connexion à la base de données
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }

    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
};
