import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const products = await sql`
      SELECT * FROM products WHERE id = ${id} OR slug = ${id} LIMIT 1
    `

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product: products[0] })
  } catch (error) {
    console.error('[v0] Get product error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du produit' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { 
      name, slug, description, price, stock, 
      categoryId, platform, region, type, 
      imageUrl, gallery, isFeatured 
    } = body

    const result = await sql`
      UPDATE products
      SET 
        name = ${name},
        slug = ${slug},
        description = ${description},
        price = ${price},
        stock = ${stock},
        category_id = ${categoryId},
        platform = ${platform},
        region = ${region},
        type = ${type},
        image_url = ${imageUrl},
        gallery = ${JSON.stringify(gallery)},
        is_featured = ${isFeatured || false},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product: result[0] })
  } catch (error) {
    console.error('[v0] Update product error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await sql`
      DELETE FROM products WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Delete product error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    )
  }
}
