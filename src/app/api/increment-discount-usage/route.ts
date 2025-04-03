import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { discountCode } = await request.json();
    
    if (!discountCode) {
      return NextResponse.json({
        error: 'Discount code is required'
      }, { status: 400 });
    }
    
    const supabase = await createClient();
    
    // Get the discount record
    const { data: discountData, error: discountError } = await supabase
      .from('discounts')
      .select('id, used, max_uses')
      .eq('code', discountCode.toUpperCase())
      .single();
    
    if (discountError || !discountData) {
      return NextResponse.json({
        error: 'Invalid discount code'
      }, { status: 400 });
    }
    
    // Check if max uses limit has been reached
    const currentUsage = discountData.used || 0;
    if (discountData.max_uses !== null && currentUsage >= discountData.max_uses) {
      return NextResponse.json({
        error: 'This discount code has reached its maximum uses',
        maxUsesReached: true
      }, { status: 400 });
    }
    
    // Increment the 'used' counter
    const { error: updateError } = await supabase
      .from('discounts')
      .update({ used: (currentUsage + 1) })
      .eq('id', discountData.id);
    
    if (updateError) {
      throw updateError;
    }
    
    return NextResponse.json({
      success: true,
      usage: {
        code: discountCode.toUpperCase(),
        currentUsage: (currentUsage + 1),
        maxUses: discountData.max_uses
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error incrementing discount usage:', error);
    return NextResponse.json({
      error: 'An error occurred while incrementing the discount usage'
    }, { status: 500 });
  }
} 