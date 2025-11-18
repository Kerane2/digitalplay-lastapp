import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production')

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    let orders
    if (user.role === 'admin') {
      // Admin sees all orders
      orders = await sql`
        SELECT o.*, u.email, u.full_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `
    } else {
      // Customer sees only their orders
      orders = await sql`
        SELECT * FROM orders 
        WHERE user_id = ${user.userId as string}
        ORDER BY created_at DESC
      `
    }

    // Get order items for each order
    for (const order of orders) {
      const items = await sql`
        SELECT oi.*, p.name, p.image_url
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ${order.id}
      `
      order.items = items
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('[v0] Get orders error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items, total, paymentMethod } = body

    // Create order
    const orderResult = await sql`
      INSERT INTO orders (user_id, total, payment_method, status)
      VALUES (${userId}, ${total}, ${paymentMethod}, 'pending')
      RETURNING *
    `

    const order = orderResult[0]

    // Create order items
    for (const item of items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (${order.id}, ${item.productId}, ${item.quantity}, ${item.price})
      `
    }

    // Send notification to admin
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          total: order.total,
          items: items
        })
      })
    } catch (notifError) {
      console.error('[v0] Notification error:', notifError)
      // Don't fail the order if notification fails
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('[v0] Create order error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    )
  }
}
