import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing required environment variables');
  console.error('Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in backend/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  const adminEmail = 'digitalplay241@gmail.com';
  const adminPassword = '@Digitalplay241!';
  const adminName = 'Digital Play Admin';

  console.log('Creating admin account...');
  console.log('Email:', adminEmail);
  console.log('Password:', '***************');

  // Hash password
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // Insert admin user
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        email: adminEmail,
        password_hash: passwordHash,
        full_name: adminName,
        role: 'admin'
      }
    ])
    .select();

  if (error) {
    if (error.code === '23505') {
      console.log('✅ Admin account already exists!');
      console.log('📧 Email:', adminEmail);
    } else {
      console.error('❌ Error creating admin:', error);
    }
  } else {
    console.log('✅ Admin account created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password: ***************');
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
  }

  process.exit(0);
}

createAdmin();
