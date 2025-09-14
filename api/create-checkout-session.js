import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).json({error:'Method Not Allowed'});
  try{
    const session = await stripe.checkout.sessions.create({
      mode:'payment', locale:'ja', currency:'jpy',
      line_items:[{price_data:{currency:'jpy',product_data:{name:'一点物キャップ オーダー'},unit_amount:24200},quantity:1}],
      success_url: `${req.headers.origin}/public/success.html`,
      cancel_url: `${req.headers.origin}/public/cancel.html`,
      shipping_address_collection:{allowed_countries:['JP']}
    });
    res.status(200).json({url: session.url});
  }catch(e){ console.error(e); res.status(500).json({error:'Failed to create session'}) }
}
