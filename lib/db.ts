import { createClient } from "@/lib/supabase/server"

/**
 * Legacy SQL export for backward compatibility
 * For Supabase, use getSupabaseClient() instead
 */
export const sql = async (query: string, params?: any[]) => {
  const supabase = await getSupabaseClient()
  // Note: This is a simplified version. For production, implement proper SQL execution
  throw new Error('Use Supabase client directly instead of sql function')
}

/**
 * Get Supabase client for server-side database operations
 * Use this for direct SQL queries or table operations
 */
export async function getSupabaseClient() {
  return await createClient()
}

/**
 * Execute raw SQL queries using Supabase
 * For most operations, use supabase.from('table_name') instead
 */
export async function executeSql(query: string, params?: any[]) {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase.rpc('execute_sql', {
    query,
    params,
  })
  
  if (error) throw error
  return data
}
