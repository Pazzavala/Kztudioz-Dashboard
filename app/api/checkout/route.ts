import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
   return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
   try {
      const { cartItems, customer } = await req.json();

      if (!cartItems || !customer) {
         return new NextResponse('Not enough data to checkout', { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
         // ui_mode: 'embedded',
         payment_method_types: ['card'],
         mode: 'payment',
         shipping_address_collection: {
            allowed_countries: ['US'],
         },
         shipping_options: [
            { shipping_rate: 'shr_1PqJ1VKn0cNBHMkihBBCHJ0X' },
            { shipping_rate: 'shr_1PqIy9Kn0cNBHMkiJSX1TeON' },
            { shipping_rate: 'shr_1PqIyeKn0cNBHMkifsmGQJ1M' },
         ],
         line_items: cartItems.map((cartItem: any) => ({
            price_data: {
               currency: 'usd',
               product_data: {
                  name: cartItem.item.title,
                  metadata: {
                     productId: cartItem.item._id,
                  },
               },
               unit_amount: cartItem.item.price * 100,
            },
            quantity: cartItem.quantity,
         })),
         client_reference_id: customer.clerkId,
         success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
         cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
      });

      return NextResponse.json(session, { headers: corsHeaders });
   } catch (err) {
      console.log('[checkout_POST]', err);
      return new NextResponse('Internal Server Error', { status: 500 });
   }
}
