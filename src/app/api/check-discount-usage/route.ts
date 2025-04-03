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
    
    // Get the discount details including max_uses and used
    const { data: discountData, error: discountError } = await supabase
      .from('discounts')
      .select('id, code, max_uses, used, discount_percent')
      .eq('code', discountCode.toUpperCase())
      .single();
    
    if (discountError || !discountData) {
      return NextResponse.json({
        error: 'Invalid discount code'
      }, { status: 404 });
    }
    
    // Calculate usage information from the discount record
    const currentUsage = discountData.used || 0;
    const maxUses = discountData.max_uses === null ? "unlimited" : discountData.max_uses;
    const remaining = discountData.max_uses === null ? "unlimited" : Math.max(0, discountData.max_uses - currentUsage);
    const isValid = discountData.max_uses === null || currentUsage < discountData.max_uses;
    
    return NextResponse.json({
      code: discountData.code,
      currentUsage,
      maxUses,
      remaining,
      isValid,
      discountPercent: discountData.discount_percent
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error checking discount usage:', error);
    return NextResponse.json({
      error: 'An error occurred while checking the discount usage'
    }, { status: 500 });
  }
} 