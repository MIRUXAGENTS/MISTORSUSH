import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, fetchProducts, fetchSiteStatus } from '@/lib/supabase-server';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 3 * 60 * 1000; // 3 minutes

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  if (rateLimitMap.has(ip)) {
    const lastRequest = rateLimitMap.get(ip)!;
    if (now - lastRequest < RATE_LIMIT_WINDOW) {
      return NextResponse.json({ error: 'Please wait before placing another order.' }, { status: 429 });
    }
  }

  try {
    const body = await req.json();
    const { 
      customer_name, 
      customer_phone, 
      delivery_address, 
      order_type, 
      comment, 
      delivery_time, 
      cart,
      customer_email,
      is_promo_active
    } = body;

    // 1. Check if site is disabled
    const isSiteActive = await fetchSiteStatus();
    if (!isSiteActive) {
      return NextResponse.json({ error: 'We are currently not accepting new orders.' }, { status: 403 });
    }

    // 2. Fetch fresh products to verify prices
    const products = await fetchProducts();
    const productMap = new Map(products.map(p => [p.id.toString(), p]));

    // 3. Re-calculate subtotal and discount
    let subtotal = 0;
    const bakedPrices: number[] = [];
    const bakedCategory = 'Запеченные роллы';

    for (const [id, count] of Object.entries(cart as Record<string, number>)) {
      const product = productMap.get(id);
      if (product && count > 0) {
        subtotal += product.price * count;
        if (product.category === bakedCategory) {
          for (let i = 0; i < count; i++) {
            bakedPrices.push(product.price);
          }
        }
      }
    }

    let discount = 0;
    if (is_promo_active) {
      const freeCount = Math.floor(bakedPrices.length / 3);
      if (freeCount > 0) {
        bakedPrices.sort((a, b) => a - b);
        discount = bakedPrices.slice(0, freeCount).reduce((acc, p) => acc + p, 0);
      }
    }

    const finalSubtotal = subtotal - discount;
    const deliveryCost = (order_type === 'Доставка' && finalSubtotal < 250) ? 30 : 0;
    const total = finalSubtotal + deliveryCost;

    // 4. Insert into Database
    const supabase = createServerClient();
    const orderData = {
      customer_name,
      customer_phone,
      delivery_address,
      order_type,
      comment,
      total_sum: total,
      status: 'new',
      delivery_time,
      customer_email: customer_email || null,
      items_json: { cart, server_verified: true },
    };

    const { data: order, error } = await supabase.from('orders').insert([orderData]).select().single();

    if (error) {
      console.error('DB Error:', error);
      return NextResponse.json({ error: 'Failed to create order in database.' }, { status: 500 });
    }

    // 5. Success
    rateLimitMap.set(ip, now);
    return NextResponse.json({ success: true, orderId: order.id, total });

  } catch (error: any) {
    console.error('Order API Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
