import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const categories = await sql`
      SELECT * FROM categories ORDER BY created_at DESC
    `

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('[v0] Get categories error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, imageUrl } = body

    const result = await sql`
      INSERT INTO categories (name, slug, description, image_url)
      VALUES (${name}, ${slug}, ${description}, ${imageUrl})
      RETURNING *
    `

    return NextResponse.json({ category: result[0] })
  } catch (error) {
    console.error('[v0] Create category error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    )
  }
}
