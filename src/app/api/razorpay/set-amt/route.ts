import { supabase } from '@/utils/supabase/supabase-client';
import { NextResponse } from 'next/server';

// Initialize Razorpay with environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

export async function POST(request: Request) {
  try {
    const { userId, amount = 39, mobileNumber } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order at Razorpay
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: "Waitlist Payment on PICTRIFY",
        notes: {
          userId,
          purpose: 'waitlist'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.description || 'Failed to create order' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: RAZORPAY_KEY_ID,
      mobileNumber: mobileNumber || ''
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 