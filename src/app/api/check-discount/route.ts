import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { discountCode } = await request.json();
    
    if (!discountCode) {
      return NextResponse.json({
        valid: false,
        error: 'Discount code is required'
      }, { status: 400 });
    }
    
    const supabase = await createClient();
    
    // Check if discount code exists and is valid
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('code', discountCode.toUpperCase())
      .single();
    
    if (error || !data) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid discount code'
      }, { status: 200 });
    }
    
    // Check if discount is expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({
        valid: false,
        error: 'This discount code has expired'
      }, { status: 200 });
    }
    
    // Check if max uses is reached by comparing max_uses with used fields
    if (data.max_uses !== null && data.max_uses > 0) {
      const currentUsage = data.used || 0;
      
      if (currentUsage >= data.max_uses) {
        return NextResponse.json({
          valid: false,
          error: 'This discount code has reached its maximum uses'
        }, { status: 200 });
      }
    }
    
    // Return discount details
    return NextResponse.json({
      valid: true,
      discount: {
        id: data.id,
        code: data.code,
        discountPercent: data.discount_percent
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error checking discount:', error);
    return NextResponse.json({
      valid: false,
      error: 'An error occurred while checking the discount code'
    }, { status: 500 });
  }
} 