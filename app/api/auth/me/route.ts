import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production')

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Verify JWT
    const { payload } = await jwtVerify(token, JWT_SECRET)

    // Get user from database
    const users = await sql`
      SELECT id, email, full_name, role, created_at, updated_at 
      FROM users 
      WHERE id = ${payload.userId as string}
      LIMIT 1
    `

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user: users[0] })
  } catch (error) {
    console.error('[v0] Auth me error:', error)
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    )
  }
}
