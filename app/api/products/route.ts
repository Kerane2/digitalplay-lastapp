import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    let products
    
    if (category && search && featured === 'true') {
      products = await sql`
        SELECT * FROM products 
        WHERE category_id = ${category}
        AND (name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`})
        AND is_featured = true
        ORDER BY created_at DESC
      `
    } else if (category && search) {
      products = await sql`
        SELECT * FROM products 
        WHERE category_id = ${category}
        AND (name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`})
        ORDER BY created_at DESC
      `
    } else if (category && featured === 'true') {
      products = await sql`
        SELECT * FROM products 
        WHERE category_id = ${category}
        AND is_featured = true
        ORDER BY created_at DESC
      `
    } else if (search && featured === 'true') {
      products = await sql`
        SELECT * FROM products 
        WHERE (name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`})
        AND is_featured = true
        ORDER BY created_at DESC
      `
    } else if (category) {
      products = await sql`
        SELECT * FROM products 
        WHERE category_id = ${category}
        ORDER BY created_at DESC
      `
    } else if (search) {
      products = await sql`
        SELECT * FROM products 
        WHERE name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`}
        ORDER BY created_at DESC
      `
    } else if (featured === 'true') {
      products = await sql`
        SELECT * FROM products 
        WHERE is_featured = true
        ORDER BY created_at DESC
      `
    } else {
      products = await sql`
        SELECT * FROM products 
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error('[v0] Get products error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, slug, description, price, stock, 
      categoryId, platform, region, type, 
      imageUrl, gallery, isFeatured 
    } = body

    const result = await sql`
      INSERT INTO products (
        name, slug, description, price, stock, 
        category_id, platform, region, type, 
        image_url, gallery, is_featured
      )
      VALUES (
        ${name}, ${slug}, ${description}, ${price}, ${stock},
        ${categoryId}, ${platform}, ${region}, ${type},
        ${imageUrl}, ${JSON.stringify(gallery)}, ${isFeatured || false}
      )
      RETURNING *
    `

    return NextResponse.json({ product: result[0] })
  } catch (error) {
    console.error('[v0] Create product error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
}
