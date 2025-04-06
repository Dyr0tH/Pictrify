import { supabase } from '@/utils/supabase/supabase-client';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Initialize Razorpay with environment variables
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId
    } = await request.json();

    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Get user's current credits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    // Add 15 credits to user's account for joining waitlist
    const newCredits = (userData?.credits || 0) + 15;
    
    const { error: updateError } = await supabase
      .from('users')
      .update({
        credits: newCredits,
      })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update credits' },
        { status: 500 }
      );
    }

    const { error: transactionError } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        amount: 39, // Standard waitlist amount
        type: 'RAZORPAY',
        razorpay_id: razorpay_payment_id,
      }]);

    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
      // Don't throw here as credits are already added
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and credits added',
      credits: newCredits
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 